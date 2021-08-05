import { Coding } from '../local_dts/fhir5';

/**
 * Code Values for the Patient.gender field
 */
 export enum PatientGenderCodes {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  UNKNOWN = 'unknown',
}

/**
 * Code Values for the Group.type field
 */
 export enum GroupTypeCodes {
  PERSON = 'person',
  ANIMAL = 'animal',
  PRACTITIONER = 'practitioner',
  DEVICE = 'device',
  MEDICATION = 'medication',
  SUBSTANCE = 'substance',
}

/**
 * Code Values for the Encounter.status field
 */
 export enum EncounterStatusCodes4 {
  PLANNED = 'planned',
  ARRIVED = 'arrived',
  TRIAGED = 'triaged',
  IN_PROGRESS = 'in-progress',
  ONLEAVE = 'onleave',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
  ENTERED_IN_ERROR = 'entered-in-error',
  UNKNOWN = 'unknown',
}

/**
 * Code Values for the Encounter.status field
 */
 export enum EncounterStatusCodes5 {
  PLANNED = 'planned',
  IN_PROGRESS = 'in-progress',
  ONHOLD = 'onhold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ENTERED_IN_ERROR = 'entered-in-error',
  UNKNOWN = 'unknown',
}

/**
 * Code Values for the Subscription.content field
 */
 export enum SubscriptionContentCodes {
  EMPTY = 'empty',
  ID_ONLY = 'id-only',
  FULL_RESOURCE = 'full-resource',
}

export enum SubscriptionChannelTypeCodes {
  REST_HOOK = 'rest-hook',
  WEBSOCKET = 'websocket',
  EMAIL = 'email',
  MESSAGE = 'message',
}

export enum SubscriptionStatusCodes {
  REQUESTED = 'requested',
  ACTIVE = 'active',
  ERROR = 'error',
  OFF = 'off',
}


/**
 * Code Values for the SubscriptionTopic.canFilterBy.searchModifier field
 */
 export enum SubscriptionFilterByModifierCodes {
  EQUALS = '=',
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  LT = 'lt',
  GE = 'ge',
  LE = 'le',
  SA = 'sa',
  EB = 'eb',
  AP = 'ap',
  ABOVE = 'above',
  BELOW = 'below',
  IN = 'in',
  NOT_IN = 'not-in',
  OF_TYPE = 'of-type',
}

/**
 * Code Values for the SubscriptionStatus.notificationType field
 */
 export enum SubscriptionNotificationTypeCodes {
  HANDSHAKE = 'handshake',
  HEARTBEAT = 'heartbeat',
  EVENT_NOTIFICATION = 'event-notification',
  QUERY_STATUS = 'query-status',
  QUERY_EVENT = 'query-event',
}

/**
 * Code Values for the CapabilityStatement.rest.resource.interaction.code field
 */
 export enum CapabilityStatementRestResourceInteractionCodeCodes {
  READ = 'read',
  VREAD = 'vread',
  UPDATE = 'update',
  PATCH = 'patch',
  DELETE = 'delete',
  HISTORY_INSTANCE = 'history-instance',
  HISTORY_TYPE = 'history-type',
  CREATE = 'create',
  SEARCH_TYPE = 'search-type',
}

export enum BundleTypeCodes4 {
  DOCUMENT = 'document',
  MESSAGE = 'message',
  TRANSACTION = 'transaction',
  TRANSACTION_RESPONSE = 'transaction-response',
  BATCH = 'batch',
  BATCH_RESPONSE = 'batch-response',
  HISTORY = 'history',
  SEARCHSET = 'searchset',
  COLLECTION = 'collection',
}

export enum BundleTypeCodes5 {
  DOCUMENT = 'document',
  MESSAGE = 'message',
  TRANSACTION = 'transaction',
  TRANSACTION_RESPONSE = 'transaction-response',
  BATCH = 'batch',
  BATCH_RESPONSE = 'batch-response',
  HISTORY = 'history',
  SEARCHSET = 'searchset',
  COLLECTION = 'collection',
  SUBSCRIPTION_NOTIFICATION = 'subscription-notification',
}

const v3_ActEncounterCode_AMB: Coding = {
  code: 'AMB',
  display: 'ambulatory',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
const v3_ActEncounterCode_EMER: Coding = {
  code: 'EMER',
  display: 'emergency',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
const v3_ActEncounterCode_FLD: Coding = {
  code: 'FLD',
  display: 'field',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
const v3_ActEncounterCode_HH: Coding = {
  code: 'HH',
  display: 'home health',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
const v3_ActEncounterCode_IMP: Coding = {
  code: 'IMP',
  display: 'inpatient encounter',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
const v3_ActEncounterCode_ACUTE: Coding = {
  code: 'ACUTE',
  display: 'inpatient acute',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
const v3_ActEncounterCode_NONAC: Coding = {
  code: 'NONAC',
  display: 'inpatient non-acute',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
const v3_ActEncounterCode_OBSENC: Coding = {
  code: 'OBSENC',
  display: 'observation encounter',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
const v3_ActEncounterCode_PRENC: Coding = {
  code: 'PRENC',
  display: 'pre-admission',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
const v3_ActEncounterCode_SS: Coding = {
  code: 'SS',
  display: 'short stay',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
const v3_ActEncounterCode_VR: Coding = {
  code: 'VR',
  display: 'virtual',
  system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
};
/**
*  Domain provides codes that qualify the ActEncounterClass (ENC)
*/
export const v3_ActEncounterCode = {
/**
 * A comprehensive term for health care provided in a healthcare facility (e.g. a practitioneraTMs office, clinic setting, or hospital) on a nonresident basis. The term ambulatory usually implies that the patient has come to the location and is not assigned to a bed. Sometimes referred to as an outpatient encounter.
 */
AMB: v3_ActEncounterCode_AMB,
/**
 * A patient encounter that takes place at a dedicated healthcare service delivery location where the patient receives immediate evaluation and treatment, provided until the patient can be discharged or responsibility for the patient's care is transferred elsewhere (for example, the patient could be admitted as an inpatient or transferred to another facility.)
 */
EMER: v3_ActEncounterCode_EMER,
/**
 * A patient encounter that takes place both outside a dedicated service delivery location and outside a patient's residence. Example locations might include an accident site and at a supermarket.
 */
FLD: v3_ActEncounterCode_FLD,
/**
 * Healthcare encounter that takes place in the residence of the patient or a designee
 */
HH: v3_ActEncounterCode_HH,
/**
 * A patient encounter where a patient is admitted by a hospital or equivalent facility, assigned to a location where patients generally stay at least overnight and provided with room, board, and continuous nursing service.
 */
IMP: v3_ActEncounterCode_IMP,
/**
 * An acute inpatient encounter.
 */
ACUTE: v3_ActEncounterCode_ACUTE,
/**
 * Any category of inpatient encounter except 'acute'
 */
NONAC: v3_ActEncounterCode_NONAC,
/**
 * An encounter where the patient usually will start in different encounter, such as one in the emergency department (EMER) but then transition to this type of encounter because they require a significant period of treatment and monitoring to determine whether or not their condition warrants an inpatient admission or discharge. In the majority of cases the decision about admission or discharge will occur within a time period determined by local, regional or national regulation, often between 24 and 48 hours.
 */
OBSENC: v3_ActEncounterCode_OBSENC,
/**
 * A patient encounter where patient is scheduled or planned to receive service delivery in the future, and the patient is given a pre-admission account number. When the patient comes back for subsequent service, the pre-admission encounter is selected and is encapsulated into the service registration, and a new account number is generated.
   * 
   *                         
   *                            Usage Note: This is intended to be used in advance of encounter types such as ambulatory, inpatient encounter, virtual, etc.
 */
PRENC: v3_ActEncounterCode_PRENC,
/**
 * An encounter where the patient is admitted to a health care facility for a predetermined length of time, usually less than 24 hours.
 */
SS: v3_ActEncounterCode_SS,
/**
 * A patient encounter where the patient and the practitioner(s) are not in the same physical location. Examples include telephone conference, email exchange, robotic surgery, and televideo conference.
 */
VR: v3_ActEncounterCode_VR,
}

const SubscriptionChannelType_rest_hook: Coding = {
  code: 'rest-hook',
  display: 'Rest Hook',
  system: 'http://terminology.hl7.org/CodeSystem/subscription-channel-type'
};
const SubscriptionChannelType_websocket: Coding = {
  code: 'websocket',
  display: 'Websocket',
  system: 'http://terminology.hl7.org/CodeSystem/subscription-channel-type'
};
const SubscriptionChannelType_email: Coding = {
  code: 'email',
  display: 'Email',
  system: 'http://terminology.hl7.org/CodeSystem/subscription-channel-type'
};
const SubscriptionChannelType_message: Coding = {
  code: 'message',
  display: 'Message',
  system: 'http://terminology.hl7.org/CodeSystem/subscription-channel-type'
};
/**
* Core-defined FHIR channel types allowed for use in Subscriptions.
*/
export const SubscriptionChannelType = {
/**
 * The channel is executed by making a POST to the URI with the selected payload and MIME type.
 */
rest_hook: SubscriptionChannelType_rest_hook,
/**
 * The channel is executed by sending a packet across a web socket connection maintained by the client. The URL identifies the websocket, and the client binds to this URL.
 */
websocket: SubscriptionChannelType_websocket,
/**
 * The channel is executed by sending an email to the email addressed in the URI (which must be a mailto:).
 */
email: SubscriptionChannelType_email,
/**
 * The channel is executed by sending a message (e.g. a Bundle with a MessageHeader resource etc.) to the application identified in the URI.
 */
message: SubscriptionChannelType_message,
}