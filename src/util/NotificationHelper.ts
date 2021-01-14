import * as fhir4 from "../models/fhir_r4";
import * as fhir5 from "../models/fhir_r5";

export interface NotificationReturn {
  success: boolean;

  bundleType: string;
  eventsSinceSubscriptionStart: number;
  eventsInNotification: number;
  status: string;
  topicUrl: string;
  subscription: string;
  notificationType:string;

  bundle: fhir4.Bundle|fhir5.Bundle|undefined;

  entriesWithFullUrl: number;
  entriesWithResource: number;
}

export class NotificationHelper {
  /**
   * Parse a notification message
   * @param useR4 
   * @param message 
   */
  static ParseNotificationMessage(useR4:boolean, message: string):NotificationReturn {
    let notificaitonReturn: NotificationReturn;

    if (useR4) {
      notificaitonReturn = this.ParseNotificationMessageR4(message);
    } else {
      notificaitonReturn = this.ParseNotificationMessageR5(message);
    }

    return notificaitonReturn;
  }

  private static ParseNotificationMessageR4(message:string):NotificationReturn {
    let notificationReturn: NotificationReturn = this.GetFailedReturn();
    let bundle: fhir4.Bundle;

		try {
			bundle = JSON.parse(message);
		} catch(error) {
			// assume non-bundle message got through
      return notificationReturn;
    }
    
    notificationReturn.bundle = bundle;
    notificationReturn.bundleType = bundle.type;

    if (bundle.type !== fhir4.BundleTypeCodes.HISTORY) {
      console.log(`ParseNotificationR4 failed, expected bundle type 'history', received: ${bundle.type}`)
      return notificationReturn;
    }

    if ((!bundle.entry) ||
        (bundle.entry!.length < 1) ||
        (!bundle.entry[0].resource)) {
      return notificationReturn;
    }

    let statusParameters: fhir4.Parameters;

    try {
      statusParameters = bundle.entry[0].resource as fhir4.Parameters;
		} catch(error) {
      return notificationReturn;
    }

    if ((!statusParameters.parameter) ||
        (statusParameters.parameter.length === 0)) {
      return notificationReturn;
    }

    statusParameters.parameter!.forEach((parameter) => {
      if (!parameter.name) {
        return;
      }

      switch (parameter.name) {
        case 'events-since-subscription-start':
            if (parameter.valueUnsignedInt) {
            notificationReturn.eventsSinceSubscriptionStart = Number(parameter.valueUnsignedInt);
          }
          break;
        case 'events-in-notification':
          if (parameter.valueUnsignedInt) {
            notificationReturn.eventsInNotification = Number(parameter.valueUnsignedInt);
          }
          break;
        case 'topic':
          if (parameter.valueUri) {
            notificationReturn.topicUrl = parameter.valueUri;
          }
          break;
        case 'subscription':
          if (parameter.valueReference) {
            if (parameter.valueReference.reference) {
              notificationReturn.subscription = parameter.valueReference.reference!;
            }
          }
          break;
        case 'type':
          if (parameter.valueCode) {
            notificationReturn.notificationType = parameter.valueCode;
          }
          break;
        case 'status':
          if (parameter.valueCode) {
            notificationReturn.status = parameter.valueCode;
          }
      };
    });

    if (notificationReturn.notificationType === fhir5.SubscriptionStatusNotificationTypeCodes.HANDSHAKE) {
      notificationReturn.eventsSinceSubscriptionStart = 0;
      notificationReturn.eventsInNotification = 0;
    } else if (notificationReturn.notificationType === fhir5.SubscriptionStatusNotificationTypeCodes.HEARTBEAT) {
      notificationReturn.eventsInNotification = 0;
    }

    if (bundle.entry.length > 1) {
      bundle.entry.forEach((entry, index) => {
        if (index === 0) {
          return;
        }

        if (entry.fullUrl) {
          notificationReturn.entriesWithFullUrl++;
        }

        if (entry.resource) {
          notificationReturn.entriesWithResource++;
        }
      })
    }

    notificationReturn.success = true;

    return notificationReturn;
  }

  private static ParseNotificationMessageR5(message:string):NotificationReturn {
    let notificationReturn: NotificationReturn = this.GetFailedReturn();
    let bundle: fhir5.Bundle;

		try {
			bundle = JSON.parse(message);
		} catch(error) {
			// assume non-bundle message got through
      return notificationReturn;
    }

    notificationReturn.bundle = bundle;
    notificationReturn.bundleType = bundle.type;

    if (bundle.type !== fhir5.BundleTypeCodes.SUBSCRIPTION_NOTIFICATION) {
      return notificationReturn;
    }

    if ((!bundle.entry) ||
        (bundle.entry!.length < 1) ||
        (!bundle.entry[0].resource)) {
      return notificationReturn;
    }

    let subscriptionStatus: fhir5.SubscriptionStatus;

    try {
      subscriptionStatus = bundle.entry[0].resource as fhir5.SubscriptionStatus;
		} catch(error) {
      return notificationReturn;
    }

    if (subscriptionStatus.eventsSinceSubscriptionStart) {
      notificationReturn.eventsSinceSubscriptionStart = Number(subscriptionStatus.eventsSinceSubscriptionStart!);
    }

    if (subscriptionStatus.eventsInNotification) {
      notificationReturn.eventsInNotification = Number(subscriptionStatus.eventsInNotification!);
    }

    if (subscriptionStatus.status) {
      notificationReturn.status = subscriptionStatus.status!;
    }

    if ((subscriptionStatus.topic) && (subscriptionStatus.topic)) {
      notificationReturn.topicUrl = subscriptionStatus.topic;
    }

    if (subscriptionStatus.subscription.reference) {
      notificationReturn.subscription = subscriptionStatus.subscription.reference!;
    }

    notificationReturn.notificationType = subscriptionStatus.type;
    if (notificationReturn.notificationType === fhir5.SubscriptionStatusNotificationTypeCodes.HANDSHAKE) {
      notificationReturn.eventsSinceSubscriptionStart = 0;
      notificationReturn.eventsInNotification = 0;
    } else if (notificationReturn.notificationType === fhir5.SubscriptionStatusNotificationTypeCodes.HEARTBEAT) {
      notificationReturn.eventsInNotification = 0;
    }

    if (bundle.entry.length > 1) {
      bundle.entry.forEach((entry, index) => {
        if (index === 0) {
          return;
        }

        if (entry.fullUrl) {
          notificationReturn.entriesWithFullUrl++;
        }

        if (entry.resource) {
          notificationReturn.entriesWithResource++;
        }
      })
    }

    notificationReturn.success = true;

    return notificationReturn;
  }

  private static GetFailedReturn():NotificationReturn {
    return {
      success: false,
      bundleType: '',
      eventsSinceSubscriptionStart: 0,
      eventsInNotification: 0,
      status: '',
      topicUrl: '',
      subscription: '',
      notificationType: '',
      bundle: undefined,
      entriesWithFullUrl: 0,
      entriesWithResource: 0,
    };
  }

}