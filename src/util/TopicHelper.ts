import * as fhir4 from "../models/fhir_r4";
import * as fhir5 from "../models/fhir_r5";
import { SingleRequestData, RenderDataAsTypes } from "../models/RequestData";
import { ConnectionInformation } from "../models/ConnectionInformation";
import { ApiHelper, ApiResponse } from "./ApiHelper";

export interface TopicReturn {
  data: SingleRequestData;
  topics: fhir5.SubscriptionTopic[];
  success: boolean;
}

export class TopicHelper {

  static async GetTopics(
    useR4: boolean,
    fhirServerInfo: ConnectionInformation
    ):Promise<TopicReturn> {

    if (useR4) {
      return this.GetTopicsR4(fhirServerInfo);
    }

    return this.GetTopicsR5(fhirServerInfo);
  }

  private static async GetTopicsR4(
    fhirServerInfo: ConnectionInformation
    ):Promise<TopicReturn> {

    let topicReturn:TopicReturn;
    
    let url: string = new URL('Subscription/$topic-list', fhirServerInfo.url).toString();

    try {
      let response:ApiResponse<fhir4.Parameters> = await ApiHelper.apiGetFhir(
        url,
        fhirServerInfo.authHeaderContent);

      if (!response.value) {
        topicReturn = {
          topics: [],
          success: false,
          data: {
            name: 'SubscriptionTopic Search',
            id: 'subscriptiontopic_search', 
            requestUrl: url,
            responseData: `Request for SubscriptionTopic list (${url}) failed:\n` +
              `${response.statusCode} - "${response.statusText}"\n` +
              `${response.body}`,
            responseDataType: RenderDataAsTypes.Error,
            outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          },
        };

        return topicReturn;
      }

      topicReturn = {
        topics: [],
        success: true,
        data: {
          name: 'SubscriptionTopic Search',
            id: 'subscriptiontopic_search', 
            requestUrl: url,
            responseData: JSON.stringify(response.value, null, 2),
            responseDataType: RenderDataAsTypes.FHIR,
            outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
        },
      };

      if (response.value.parameter) {
        response.value.parameter.forEach((parameter) => {
          if (parameter.name !== 'subscription-topic-canonical') return;

          if (parameter.valueCanonical) {
            let filters:fhir5.SubscriptionTopicCanFilterBy[]|undefined = undefined;

            if ((parameter.valueCanonical === 'http://argonautproject.org/encounters-ig/SubscriptionTopic/encounter-start') ||
                (parameter.valueCanonical === 'http://argonautproject.org/encounters-ig/SubscriptionTopic/encounter-end')) {
              filters = [];
              filters.push({
                documentation: 'Exact match to a patient resource (reference)',
                searchParamName: 'patient',
                searchModifier: ['=', 'in'],
              });
            }

            topicReturn!.topics!.push({
              resourceType: 'SubscriptionTopic',
              id: `backported_subscriptiontopic_${topicReturn.topics.length}`,
              url: parameter.valueCanonical,
              status: fhir5.SubscriptionTopicStatusCodes.UNKNOWN,
              title: 'Backported SubscriptionTopic',
              canFilterBy: filters,
            });
          }
        });
      }

      return topicReturn;

    } catch (err) {
      topicReturn = {
        topics: [],
        success: false,
        data: {
          name: 'SubscriptionTopic Search',
          id: 'subscriptiontopic_search', 
          requestUrl: url,
          responseData: `Failed to get topic list from: ${url}:\n${err}`,
          responseDataType: RenderDataAsTypes.Error,
        },
      };

      return topicReturn;
    }
  }

  private static async GetTopicsR5(
      fhirServerInfo: ConnectionInformation
      ):Promise<TopicReturn> {

    let topicReturn:TopicReturn;
    
    let url: string = new URL('SubscriptionTopic', fhirServerInfo.url).toString();

    try {
      let response:ApiResponse<fhir5.Bundle> = await ApiHelper.apiGetFhir(
        url,
        fhirServerInfo.authHeaderContent
      );

      if (!response.value) {
        topicReturn = {
          topics: [],
          success: false,
          data: {
            name: 'SubscriptionTopic Search',
            id: 'subscriptiontopic_search', 
            requestUrl: url,
            responseData: `Request for SubscriptionTopic list (${url}) failed:\n` +
              `${response.statusCode} - "${response.statusText}"\n` +
              `${response.body}`,
            responseDataType: RenderDataAsTypes.Error,
            outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          },
        };

        return topicReturn;
      }

      topicReturn = {
        topics: [],
        success: true,
        data: {
          name: 'SubscriptionTopic Search',
            id: 'subscriptiontopic_search', 
            requestUrl: url,
            responseData: JSON.stringify(response.value, null, 2),
            responseDataType: RenderDataAsTypes.FHIR,
            outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
        },
      };

      if (response.value.entry) {
        response.value.entry.forEach((entry) => {
          if (!entry.resource) return;

          topicReturn!.topics!.push(entry.resource as fhir5.SubscriptionTopic);
        });
      }

      return topicReturn;

    } catch (err) {

      topicReturn = {
        topics: [],
        success: false,
        data: {
          name: 'SubscriptionTopic Search',
          id: 'subscriptiontopic_search', 
          requestUrl: url,
          responseData: `Failed to get topic list from: ${url}:\n${err}`,
          responseDataType: RenderDataAsTypes.Error,
        },
      };

      return topicReturn;
    }
  }

}