import * as fhir4 from "../models/fhir_r4";
import * as fhir5 from "../models/fhir_r5";
import { SingleRequestData, RenderDataAsTypes } from "../models/RequestData";
import { ConnectionInformation } from "../models/ConnectionInformation";
import { ApiHelper, ApiResponse } from "./ApiHelper";

export interface SubscriptionReturn {
  data: SingleRequestData;
  subscription?: fhir5.Subscription;
  success: boolean;
}

const ExtensionUrlTopic = 'http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-topic-canonical';
const ExtensionUrlHeartbeat = 'http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-heartbeat-period';
const ExtensionUrlTimeout = 'http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-timeout';
const ExtensionUrlContent = 'http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-payload-content';
const CanonicalChannelType = 'http://hl7.org/fhir/ValueSet/subscription-channel-type';

export class SubscriptionHelper {

  /**
   * Create a Subscription on a FHIR server
   * @param useR4 
   * @param fhirServerInfo 
   * @param subscription 
   * @param topic 
   */
  static async CreateSubscription(
    useR4: boolean,
    fhirServerInfo: ConnectionInformation,
    subscription: fhir5.Subscription,
    topic?: fhir5.SubscriptionTopic|null
    ):Promise<SubscriptionReturn> {

    if (useR4) {
      return this.CreateSubscriptionR4(fhirServerInfo, subscription, topic || undefined);
    }

    return this.CreateSubscriptionR5(fhirServerInfo, subscription);
  }

  /**
   * Update a Subscription with current data from the server
   * @param useR4 
   * @param fhirServerInfo 
   * @param subscription 
   */
  static async RefreshSubscription(
    useR4: boolean,
    fhirServerInfo: ConnectionInformation,
    subscription: fhir5.Subscription
  ):Promise<SubscriptionReturn> {
    let subscriptionReturn: SubscriptionReturn;

    let url: string = new URL(`Subscription/${subscription.id!}`, fhirServerInfo.url).toString();

    try {
      if (useR4) {
        let response: ApiResponse<fhir4.Subscription> = await ApiHelper.apiGetFhir(
          url,
          fhirServerInfo.authHeaderContent,
          '4.0'
        );

        if (!response.value) {
          subscriptionReturn = {
            subscription: undefined,
            success: false,
            data: {
              name: 'Refresh Subscription',
              id: 'refresh_subscription', 
              requestUrl: url,
              responseData: `Request for Subscription (${url}) failed:\n` +
                `${response.statusCode} - "${response.statusText}"\n` +
                `${response.body}`,
              responseDataType: RenderDataAsTypes.Error,
              outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
            },
          };
  
          return subscriptionReturn;
        }

        let s5: fhir5.Subscription = this.ToR5(response.value!);

        subscriptionReturn = {
          subscription: s5,
          success: true,
          data: {
            name: 'Refresh Subscription',
            id: 'refresh_subscription', 
            requestUrl: url,
            responseData: JSON.stringify(response.value, null, 2),
            responseDataType: RenderDataAsTypes.FHIR,
            outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          },
        };
  
        return subscriptionReturn;
      }

      let response: ApiResponse<fhir5.Subscription> = await ApiHelper.apiGetFhir(
        url,
        fhirServerInfo.authHeaderContent
      );

      if (!response.value) {
        subscriptionReturn = {
          subscription: undefined,
          success: false,
          data: {
            name: 'Refresh Subscription',
            id: 'refresh_subscription', 
            requestUrl: url,
            responseData: `Request for Subscription (${url}) failed:\n` +
              `${response.statusCode} - "${response.statusText}"\n` +
              `${response.body}`,
            responseDataType: RenderDataAsTypes.Error,
            outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          },
        };

        return subscriptionReturn;
      }

      subscriptionReturn = {
        subscription: response.value,
        success: true,
        data: {
          name: 'Refresh Subscription',
          id: 'refresh_subscription', 
          requestUrl: url,
          responseData: JSON.stringify(response.value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
        },
      };

      return subscriptionReturn;
    } catch (err) {
      subscriptionReturn = {
        subscription: undefined,
        success: false,
        data: {
          name: 'Refresh Subscription',
          id: 'refresh_subscription', 
          requestUrl: url,
          responseData: `Failed to refresh Subscription: ${url}:\n${err}`,
          responseDataType: RenderDataAsTypes.Error,
        }
      };
    }

    return subscriptionReturn;
  }


  private static async CreateSubscriptionR4(
    fhirServerInfo: ConnectionInformation,
    subscription: fhir5.Subscription,
    topic?: fhir5.SubscriptionTopic
    ):Promise<SubscriptionReturn> {

    let subscriptionReturn: SubscriptionReturn;
    
    let s4: fhir4.Subscription = this.ToR4(subscription, topic, fhirServerInfo.url)

    let url: string = new URL('Subscription', fhirServerInfo.url).toString();

    try {
      let response:ApiResponse<fhir4.Subscription> = await ApiHelper.apiPostFhir(
        url,
        s4,
        fhirServerInfo.authHeaderContent,
        fhirServerInfo.preferHeaderContent,
        '4.0'
      );

      if (!response.value) {
        subscriptionReturn = {
          subscription: undefined,
          success: false,
          data: {
            name: 'Create Subscription',
            id: 'create_subscription', 
            requestUrl: url,
            requestData: JSON.stringify(s4, null, 2),
            requestDataType: RenderDataAsTypes.FHIR,
            responseData: `Request to create Subscription (${url}) failed:\n` +
              `${response.statusCode} - "${response.statusText}"\n` +
              `${response.body}`,
            responseDataType: RenderDataAsTypes.Error,
            outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          },
        };

        return subscriptionReturn;
      }

      let s4r: fhir4.Subscription = response.value as fhir4.Subscription;

      let s5: fhir5.Subscription = this.ToR5(s4r);

      subscriptionReturn = {
        subscription: s5,
        success: true,
        data: {
          name: 'Create Subscription',
          id: 'create_subscription', 
          requestUrl: url,
          requestData: JSON.stringify(s4, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: JSON.stringify(response.value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
        },
      };

      return subscriptionReturn;
    } catch (err) {
      subscriptionReturn = {
        subscription: undefined,
        success: false,
        data: {
          name: 'Create Subscription',
          id: 'create_subscription', 
          requestUrl: url,
          requestData: JSON.stringify(s4, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: `Failed to create Subscription: ${url}:\n${err}`,
          responseDataType: RenderDataAsTypes.Error,
        },
      };

      return subscriptionReturn;
    }
  }

  private static async CreateSubscriptionR5(
      fhirServerInfo: ConnectionInformation,
      subscription: fhir5.Subscription
      ):Promise<SubscriptionReturn> {

    let subscriptionReturn: SubscriptionReturn;
    
    let url: string = new URL('Subscription', fhirServerInfo.url).toString();

    try {
      let response:ApiResponse<fhir5.Subscription> = await ApiHelper.apiPostFhir(
        url,
        subscription,
        fhirServerInfo.authHeaderContent,
        fhirServerInfo.preferHeaderContent
      );

      if (!response.value) {
        subscriptionReturn = {
          subscription: undefined,
          success: false,
          data: {
            name: 'Create Subscription',
            id: 'create_subscription', 
            requestUrl: url,
            requestData: JSON.stringify(subscription, null, 2),
            requestDataType: RenderDataAsTypes.FHIR,
            responseData: `Request to create Subscription (${url}) failed:\n` +
              `${response.statusCode} - "${response.statusText}"\n` +
              `${response.body}`,
            responseDataType: RenderDataAsTypes.Error,
            outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          },
        };

        return subscriptionReturn;
      }

      subscriptionReturn = {
        subscription: response.value as fhir5.Subscription,
        success: true,
        data: {
          name: 'Create Subscription',
          id: 'create_subscription', 
          requestUrl: url,
          requestData: JSON.stringify(subscription, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: JSON.stringify(response.value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
        },
      };

      return subscriptionReturn;
    } catch (err) {
      subscriptionReturn = {
        subscription: undefined,
        success: false,
        data: {
          name: 'Create Subscription',
          id: 'create_subscription', 
          requestUrl: url,
          requestData: JSON.stringify(subscription, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: `Failed to create Subscription: ${url}:\n${err}`,
          responseDataType: RenderDataAsTypes.Error,
        },
      };

      return subscriptionReturn;
    }
  }

  /**
   * Convert an R5 Subscription and SubscriptionTopic to R4
   * @param s5 
   * @param t5 
   */
  static ToR4(s5: fhir5.Subscription, t5?: fhir5.SubscriptionTopic, fhirServerUrl?:string):fhir4.Subscription {
    let s4:fhir4.Subscription = {
      resourceType: 'Subscription',
      id: s5.id,
      implicitRules: s5.implicitRules,
      language: s5.language,
      end: s5.end,
      reason: s5.reason || 'Backported from R5 Subscription',
      channel: {
        endpoint: s5.endpoint,
        header: s5.header,
        payload: s5.contentType,
        _payload: {
          extension: [{
            url: ExtensionUrlContent,
            valueCode: s5.content,
          }],
        },
        type: s5.channelType.code!,
      },
      status: s5.status,
      criteria: '',
    };

    if (s5.meta) {
      s4.meta = {
        lastUpdated: s5.meta.lastUpdated,
        profile: s5.meta.profile,
        source: s5.meta.source,
      }

      if (s5.meta.security) {
        s4.meta.security = [];
        s5.meta.security.forEach((c5) => {
          s4.meta!.security!.push(SubscriptionHelper.CodingToR4(c5));
        });
      }

      if (s5.meta.tag) {
        s4.meta.tag = [];
        s5.meta.tag.forEach((c5) => {
          s4.meta!.tag!.push(SubscriptionHelper.CodingToR4(c5));
        });
      }
    }

    if (t5) {
      s4.extension = [ {
        url: ExtensionUrlTopic,
        valueUri: t5.url,
        }
      ];
    } else {
      s4.extension = [ {
        url: ExtensionUrlTopic,
        valueUri: `${fhirServerUrl}SubscriptionTopic/encounter-start`,
        }
      ];
    }

    if (s5.heartbeatPeriod) {
      s4.channel.extension = [];
      s4.channel.extension.push({
        url: ExtensionUrlHeartbeat,
        valueUnsignedInt: s5.heartbeatPeriod,
      });
    }

    if (s5.timeout) {
      if (!s4.channel.extension) {
        s4.channel.extension = [];
      }
      s4.channel.extension.push({
        url: ExtensionUrlTimeout,
        valueUnsignedInt: s5.timeout,
      });
    }

    if ((s5.filterBy) && (s5.filterBy.length > 0)) {
      let critiera:string;

      if ((t5) &&
          (t5.resourceTrigger) &&
          (t5.resourceTrigger.resourceType) &&
          (t5.resourceTrigger.resourceType.length > 0)) {
        critiera = t5.resourceTrigger.resourceType[0];
      }

      let resourceDelim = s5.filterBy[0].searchParamName.indexOf('?');

      if (resourceDelim === -1) {
        critiera = 'Encounter';
      } else {
        critiera = ''
      }

      s5.filterBy.forEach((filter, index) => {
        let value: string|undefined = this.CollapseFilter(filter);

        if (value) {
          if (index === 0) {
            if (critiera) {
              critiera += '?';
            }
          } else {
            critiera += '&'
          }

          critiera += value;
        }
      });

      s4.criteria = critiera;
    }

    return s4;
  }

  static CollapseFilter(filter: fhir5.SubscriptionFilterBy): string|undefined {
    if ((!filter) ||
        (!filter.searchParamName)) {
      return undefined;
    }

    if ((!filter.searchModifier) ||
        (filter.searchModifier === fhir5.SubscriptionFilterBySearchModifierCodes.EQUALS) ||
        (filter.searchModifier === fhir5.SubscriptionFilterBySearchModifierCodes.EQ)) {
      return `${filter.searchParamName}=${filter.value}`;
    }

    let modifier: string = filter.searchModifier.toLowerCase();

    switch (filter.searchModifier) {
      case fhir5.SubscriptionFilterBySearchModifierCodes.ABOVE:
      case fhir5.SubscriptionFilterBySearchModifierCodes.BELOW:
      case fhir5.SubscriptionFilterBySearchModifierCodes.IN:
        return `${filter.searchParamName}:${modifier}=${filter.value}`;

      case fhir5.SubscriptionFilterBySearchModifierCodes.NOT_IN:
        return `${filter.searchParamName}:not-in=${filter.value}`;

      case fhir5.SubscriptionFilterBySearchModifierCodes.OF_TYPE:
        return `${filter.searchParamName}:of-type=${filter.value}`;

      default:
        return `${filter.searchParamName}=${modifier}${filter.value}`;
    }
  }

  /**
   * Convert an R4 subscription to R5
   * @param s4 
   */
  static ToR5(s4: fhir4.Subscription):fhir5.Subscription {
    let s5:fhir5.Subscription = {
      resourceType: 'Subscription',
      id: s4.id,
      implicitRules: s4.implicitRules,
      language: s4.language,
      end: s4.end,
      reason: s4.reason,
      endpoint: s4.channel.endpoint,
      header: s4.channel.header,
      contentType: s4.channel.payload,
      status: s4.status,
      channelType: {},
      topic: {},
    };

    if (s4.meta) {
      s5.meta = {
        lastUpdated: s4.meta.lastUpdated,
        profile: s4.meta.profile,
        source: s4.meta.source,
      }

      if (s4.meta.security) {
        s5.meta.security = [];
        s4.meta.security.forEach((c4) => {
          s5.meta!.security!.push(SubscriptionHelper.CodingToR5(c4));
        });
      }

      if (s4.meta.tag) {
        s5.meta.tag = [];
        s4.meta.tag.forEach((c4) => {
          s5.meta!.tag!.push(SubscriptionHelper.CodingToR5(c4));
        });
      }
    }

    s5.channelType = {
      system: CanonicalChannelType,
      code: s4.channel.type,
    }

    if (s4.extension) {
      s4.extension.forEach((ext) => {
        if ((ext.url === ExtensionUrlTopic) && (ext.valueUri)) {
          s5.topic = {
            reference: ext.valueUri,
          }
        }
        if ((ext.url === ExtensionUrlTopic) && (ext.valueCanonical)) {
          s5.topic = {
            reference: ext.valueCanonical,
          }
        }
      });
    }

    if (s4.channel.extension) {
      s4.channel.extension.forEach((ext) => {
        if ((ext.url === ExtensionUrlHeartbeat) && (ext.valueUnsignedInt)) {
          s5.heartbeatPeriod = ext.valueUnsignedInt;
        }
        if ((ext.url === ExtensionUrlTimeout) && (ext.valueUnsignedInt)) {
          s5.timeout = ext.valueUnsignedInt;
        }
      });
    }

    if ((s4.channel._payload) && (s4.channel._payload!.extension)) {
      s4.channel._payload.extension.forEach((ext) => {
        if ((ext.url === ExtensionUrlContent) && (ext.valueCode)) {
          s5.content = ext.valueCode;
        }
      });
    }

    if (s4.criteria) {
      let criteria: string = s4.criteria;

      const endOfResourceName: number = criteria.indexOf('?');

      criteria = criteria.substr(endOfResourceName + 1);

      let components: string[] = criteria.split('&');

      if (components.length > 0) {
        s5.filterBy = [];

        components.forEach((component) => {
          let filter: fhir5.SubscriptionFilterBy|undefined = this.ExpandFilter(component);

          if (filter) {
            s5.filterBy!.push(filter);
          }
        });
      }
    }

    return s5;
  }
  
  /**
   * Convert a search-style filter to R5 subscription filter by clauses
   * @param filter 
   */
  static ExpandFilter(filter: string):fhir5.SubscriptionFilterBy|undefined {
    if (!filter) {
      return undefined;
    }

    let components: string[] = filter.split('=');
    if (components.length !== 2) {
      console.log('Failed to parse filter', filter);
      return undefined;
    }

    let searchParam: string = components[0];
    let searchValue: string = components[1];
    let modifier: string = '';
    let searchModifier: string = '';

    if (searchParam.indexOf(':') !== -1) {
      let parts: string[] = searchParam.split(':');
      searchParam = parts[0];
      modifier = parts[1];
    }

    if ((!modifier) && (searchValue.length > 2)) {
      modifier = searchValue.substr(0, 2);
    }

    switch (modifier) {
      case 'equal':
        searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.EQUALS;
        break;

      case 'above':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.ABOVE;
          break;

      case 'below':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.BELOW;
          break;

      case 'in':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.IN;
          break;

      case 'not-in':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.NOT_IN;
          break;

      case 'of-type':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.OF_TYPE;
          break;

      case 'eq':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.EQ;
          searchValue = searchValue.substr(2);
          break;

      case 'ne':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.NE;
          searchValue = searchValue.substr(2);
          break;

      case 'gt':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.GT;
          searchValue = searchValue.substr(2);
          break;

      case 'lt':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.LT;
          searchValue = searchValue.substr(2);
          break;

      case 'ge':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.GE;
          searchValue = searchValue.substr(2);
          break;

      case 'le':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.LE;
          searchValue = searchValue.substr(2);
          break;

      case 'sa':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.SA;
          searchValue = searchValue.substr(2);
          break;

      case 'eb':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.EB;
          searchValue = searchValue.substr(2);
          break;

      case 'ap':
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.AP;
          searchValue = searchValue.substr(2);
          break;

      default:
          searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.EQUALS;
          break;
      }

      return {
        searchParamName: searchParam,
        searchModifier: searchModifier,
        value: searchValue,
      };
  }

  /**
   * Convert an R4 Coding to R5
   * @param c4 
   */
  static CodingToR5(c4: fhir4.Coding):fhir5.Coding {
    return {
      system: c4.system,
      userSelected: c4.userSelected,
      display: c4.display,
      code: c4.code,
      version: c4.version,
    }
  }

  /**
   * Convert an R5 Coding to R4
   * @param c5 
   */
  static CodingToR4(c5: fhir5.Coding):fhir4.Coding {
    return {
      system: c5.system,
      userSelected: c5.userSelected,
      display: c5.display,
      code: c5.code,
      version: c5.version,
    }
  }
}