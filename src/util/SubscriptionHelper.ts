import * as fhir4 from 'fhir4';
import * as fhir5 from 'fhir5';
import * as fhirCommon from '../models/fhirCommon';
import { SingleRequestData, RenderDataAsTypes } from "../models/RequestData";
import { ConnectionInformation } from "../models/ConnectionInformation";
import { ApiHelper, ApiResponse } from "./ApiHelper";

export interface SubscriptionReturn {
  data: SingleRequestData;
  subscription?: fhir5.Subscription;
  success: boolean;
}

const ExtensionUrlAdditionalChannelType = "http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-channel-type";
const ExtensionUrlTopic = 'http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-topic-canonical';
const ExtensionUrlHeartbeat = 'http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-heartbeat-period';
const ExtensionUrlTimeout = 'http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-timeout';
const ExtensionUrlContent = 'http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-payload-content';
const ExtensionUrlFilterCriteria = 'http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-filter-criteria';

const ZulipChannelSystem = "http://fhir-extensions.zulip.org/subscription-channel-type";
const ZulipChannelCode = "zulip";

//const ExtensionNotificationUrlLocation = "http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-notification-url-location";
const ExtensionMaxCount = "http://hl7.org/fhir/uv/subscriptions-backport/StructureDefinition/backport-max-count";

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
    topic?: fhir4.SubscriptionTopic|fhir5.SubscriptionTopic|null
    ):Promise<SubscriptionReturn> {

    if (useR4) {
      return this.CreateSubscriptionR4(fhirServerInfo, subscription, topic as fhir4.SubscriptionTopic || undefined);
    }

    return this.CreateSubscriptionR5(fhirServerInfo, subscription);
  }

  /**
   * Get a Subscription record based off of ID
   * @param useR4 
   * @param fhirServerInfo 
   * @param subscriptionId
   */
   static async GetSubscription(
    useR4: boolean,
    fhirServerInfo: ConnectionInformation,
    subscriptionId: string
  ):Promise<SubscriptionReturn> {
    let subscriptionReturn: SubscriptionReturn;

    let url: string = new URL(`Subscription/${subscriptionId}`, fhirServerInfo.url).toString();

    try {
      if (useR4) {
        let response: ApiResponse<fhir4.Subscription> = await ApiHelper.apiGetFhir(
          url,
          fhirServerInfo.authHeaderContent);

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
    return this.GetSubscription(useR4, fhirServerInfo, subscription.id!);
  }

  private static async CreateSubscriptionR4(
    fhirServerInfo: ConnectionInformation,
    subscription: fhir5.Subscription,
    topic?: fhir4.SubscriptionTopic
    ):Promise<SubscriptionReturn> {

    let subscriptionReturn: SubscriptionReturn;
    
    let s4: fhir4.Subscription = this.ToR4(subscription, topic, fhirServerInfo.url)

    let url: string = new URL('Subscription', fhirServerInfo.url).toString();

    try {
      let response:ApiResponse<fhir4.Subscription> = await ApiHelper.apiPostFhir(
        url,
        s4,
        fhirServerInfo.authHeaderContent,
        fhirServerInfo.preferHeaderContent);

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
  static ToR4(s5: fhir5.Subscription, t4?: fhir4.SubscriptionTopic, fhirServerUrl?:string):fhir4.Subscription {

    let channelType:('rest-hook'|'websocket'|'email'|'sms'|'message');
    let needsChannelTypeExtension:boolean = false;

    switch (s5.channelType.code) {
      case 'rest-hook':
      case 'websocket':
      case 'email':
      case 'message':
        needsChannelTypeExtension = false;
        channelType = s5.channelType.code! as fhir4.SubscriptionChannelTypeCodes;
        break;
      default:
        // use rest-hook plus extension
        channelType = 'rest-hook';
        needsChannelTypeExtension = true;
        break;
    }

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
        type: channelType as fhir4.SubscriptionChannelTypeCodes,
      },
      status: s5.status as fhir4.SubscriptionStatusCodes,
      criteria: '',
    };
    
    if (needsChannelTypeExtension) {
      if (!s4.channel.extension) {
        s4.channel.extension = [];
      }
      s4.channel.extension.push({
          url: ExtensionUrlAdditionalChannelType,
          valueCoding: {
            system: s5.channelType.system,
            code: s5.channelType.code,
            display: s5.channelType.display,
          }});
    }

    if (s5.extension !== undefined) {
      if (!s4.extension) {
        s4.extension = [];
      }
      s5.extension.forEach((ext) => s4.extension!.push(ext as fhir4.Extension));
    }

    if (s5.meta) {
      s4.meta = {
        lastUpdated: s5.meta.lastUpdated,
        profile: s5.meta.profile,
        source: s5.meta.source,
      }

      if (s5.meta.security) {
        s4.meta.security = [];
        s5.meta.security.forEach((c5) => {
          s4.meta!.security!.push(c5 as fhir4.Coding);
        });
      }

      if (s5.meta.tag) {
        s4.meta.tag = [];
        s5.meta.tag.forEach((c5) => {
          s4.meta!.tag!.push(c5 as fhir4.Coding);
        });
      }
    }

    if (t4) {
      s4.criteria = t4.url;
    } else {
      s4.criteria = `${fhirServerUrl}SubscriptionTopic/encounter-start`;
    }

    if (s5.heartbeatPeriod) {
      if (!s4.channel.extension) {
        s4.channel.extension = [];
      }
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
      s4._criteria = { extension: [] };

      let filterParam:string;
      let resourceDelim = s5.filterBy[0].searchParamName.indexOf('?');

      if (resourceDelim === -1) {
        filterParam = 'Encounter';
      } else {
        filterParam = ''
      }

      s5.filterBy.forEach((filter, index) => {
        let value: string|undefined = this.CollapseFilter(filter);

        if (value) {
          s4._criteria!.extension!.push({
            url: ExtensionUrlFilterCriteria,
            valueString: filterParam + '?' + value,
            });
        }
      });
      
      if (!s4.channel.extension) {
        s4.channel.extension = [];
      }

      // // TODO: Need December 2020 R5 build to add NotificationUrlLocation
      // s4.channel.extension.push({
      //   url: ExtensionNotificationUrlLocation,
      //   valueCode: "full-url",
      // });

      // TODO: Need December 2020 R5 build to add MaxCount
      s4.channel.extension.push({
        url: ExtensionMaxCount,
        valuePositiveInt: 10,
      });
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
      topic: '',
    };

    if (s4.extension) {
      if (!s5.extension) {
        s5.extension = [];
      }
      s4.extension.forEach((ext) => s5.extension!.push(ext as fhir5.Extension));
    }

    if (s4.meta) {
      s5.meta = {
        lastUpdated: s4.meta.lastUpdated,
        profile: s4.meta.profile,
        source: s4.meta.source,
      }

      if (s4.meta.security) {
        s5.meta.security = [];
        s4.meta.security.forEach((c4) => {
          s5.meta!.security!.push(c4 as fhir5.Coding);
        });
      }

      if (s4.meta.tag) {
        s5.meta.tag = [];
        s4.meta.tag.forEach((c4) => {
          s5.meta!.tag!.push(c4 as fhir5.Coding);
        });
      }
    }

    s5.channelType = {
      system: CanonicalChannelType,
      code: s4.channel.type,
    }

    // if (s4.extension) {
    //   s4.extension.forEach((ext) => {
    //     if ((ext.url === ExtensionUrlTopic) && (ext.valueUri)) {
    //       s5.topic = {
    //         reference: ext.valueUri,
    //       }
    //     }
    //     if ((ext.url === ExtensionUrlTopic) && (ext.valueCanonical)) {
    //       s5.topic = {
    //         reference: ext.valueCanonical,
    //       }
    //     }
    //   });
    // }

    if (s4.channel.extension) {
      s4.channel.extension.forEach((ext) => {
        if ((ext.url === ExtensionUrlHeartbeat) && (ext.valueUnsignedInt)) {
          s5.heartbeatPeriod = ext.valueUnsignedInt;
        }
        if ((ext.url === ExtensionUrlTimeout) && (ext.valueUnsignedInt)) {
          s5.timeout = ext.valueUnsignedInt;
        }
        if ((ext.url === ExtensionMaxCount) && (ext.valuePositiveInt)) {
          // TODO: Need December 2020 R5 build to add MaxCount
        }
      });
    }

    if ((s4.channel._payload) && (s4.channel._payload!.extension)) {
      s4.channel._payload.extension.forEach((ext) => {
        if ((ext.url === ExtensionUrlContent) && (ext.valueCode)) {
          s5.content = ext.valueCode as fhir5.SubscriptionContentCodes;
        }
      });
    }

    if (s4.criteria) {
      s5.topic = s4.criteria;
    }

    if ((s4._criteria) && (s4._criteria.extension) && (s4._criteria.extension.length > 0)) {
      s5.filterBy = [];

      s4._criteria.extension.forEach((ext) => {
        if ((ext.url === ExtensionUrlFilterCriteria) && (ext.valueString)) {
          let filter: fhir5.SubscriptionFilterBy|undefined = this.ExpandFilter(ext.valueString);

          if (filter) {
            s5.filterBy!.push(filter);
          }
        }
      });
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
        searchModifier: searchModifier as fhir5.SubscriptionFilterBySearchModifierCodes,
        value: searchValue,
      };
  }
}