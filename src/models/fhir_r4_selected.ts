/** GENERATED FILE on: 8/1/2019 3:40:55 PM **/

export module fhir {
	/**
	 * A stream of bytes
	 * From: primitives.xml
	 */
	export type base64Binary = string;
	/**
	 * A URI that is a reference to a canonical URL on a FHIR resource
	 * From: primitives.xml
	 */
	export type canonical = string;
	/**
	 * A string which has at least one character and no leading or trailing whitespace and where there is no whitespace other than single spaces in the contents
	 * From: primitives.xml
	 */
	export type code = string;
	/**
	 * A date or partial date (e.g. just year or year + month). There is no time zone. The format is a union of the schema types gYear, gYearMonth and date.  Dates SHALL be valid dates.
	 * From: primitives.xml
	 */
	export type date = string;
	/**
	 * A date, date-time or partial date (e.g. just year or year + month).  If hours and minutes are specified, a time zone SHALL be populated. The format is a union of the schema types gYear, gYearMonth, date and dateTime. Seconds must be provided due to schema type constraints but may be zero-filled and may be ignored.  Dates SHALL be valid dates.
	 * From: primitives.xml
	 */
	export type dateTime = string;
	/**
	 * A rational number with implicit precision
	 * From: primitives.xml
	 */
	export type decimal = number;
	/**
	 * A length of time
	 * From: duration.xml
	 */
	export type Duration = Quantity;
	/**
	 * Any combination of letters, numerals, "-" and ".", with a length limit of 64 characters.  (This might be an integer, an unprefixed OID, UUID or any other identifier pattern that meets these constraints.)  Ids are case-insensitive.
	 * From: primitives.xml
	 */
	export type id = string;
	/**
	 * An instant in time - known at least to the second
	 * From: primitives.xml
	 */
	export type instant = string;
	/**
	 * A whole number
	 * From: primitives.xml
	 */
	export type integer = number;
	/**
	 * A string that may contain Github Flavored Markdown syntax for optional processing by a mark down presentation engine
	 * From: primitives.xml
	 */
	export type markdown = string;
	/**
	 * An integer with a value that is positive (e.g. >0)
	 * From: primitives.xml
	 */
	export type positiveInt = number;
	/**
	 * A time during the day, with no date specified 
	 * From: primitives.xml
	 */
	export type time = string;
	/**
	 * An integer with a value that is not negative (e.g. >= 0)
	 * From: primitives.xml
	 */
	export type unsignedInt = number;
	/**
	 * String of characters used to identify a name or a resource
	 * From: primitives.xml
	 */
	export type uri = string;
	/**
	 * A URI that is a literal reference
	 * From: primitives.xml
	 */
	export type url = string;
	/**
	 * WARN: xhtml is defined as string as a definition cannot be found!
	 * From: definition-file-not-found.xml
	 */
	export type xhtml = string;
	/**
	 * An address expressed using postal conventions (as opposed to GPS or other location definition formats).  This data type may be used to convey addresses for use in delivering mail as well as for visiting locations which might not be valid for mail delivery.  There are a variety of postal address formats defined around the world.
	 * From: address.xml
	 */
	export interface Address extends Element {
		/**
		 * The name of the city, town, suburb, village or other community or delivery center
		 */
		city?: string;
		/**
		 * May contain extended information for property: 'city'
		 */
		_city?: Element;
		/**
		 * Country - a nation as commonly understood or generally accepted
		 */
		country?: string;
		/**
		 * May contain extended information for property: 'country'
		 */
		_country?: Element;
		/**
		 * The name of the administrative area (county)
		 */
		district?: string;
		/**
		 * May contain extended information for property: 'district'
		 */
		_district?: Element;
		/**
		 * This component contains the house number, apartment number, street name, street direction,  P.O. Box number, delivery hints, and similar address information
		 */
		line?: string[];
		/**
		 * May contain extended information for property: 'line'
		 */
		_line?: Element[];
		/**
		 * Time period when address was/is in use
		 */
		period?: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * A postal code designating a region defined by the postal service
		 */
		postalCode?: string;
		/**
		 * May contain extended information for property: 'postalCode'
		 */
		_postalCode?: Element;
		/**
		 * Sub-unit of a country with limited sovereignty in a federally organized country. A code may be used if codes are in common use (e.g. US 2 letter state codes)
		 */
		state?: string;
		/**
		 * May contain extended information for property: 'state'
		 */
		_state?: Element;
		/**
		 * Specifies the entire address as it should be displayed e.g. on a postal label. This may be provided instead of or as well as the specific parts
		 */
		text?: string;
		/**
		 * May contain extended information for property: 'text'
		 */
		_text?: Element;
		/**
		 * Distinguishes between physical addresses (those you can visit) and mailing addresses (e.g. PO Boxes and care-of addresses). Most addresses are both
		 */
		type?: code;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
		/**
		 * The purpose of this address
		 */
		use?: code;
		/**
		 * May contain extended information for property: 'use'
		 */
		_use?: Element;
	}
	/**
	 * A  text note which also  contains information about who made the statement and when
	 * From: annotation.xml
	 */
	export interface Annotation extends Element {
		/**
		 * The individual responsible for making the annotation.
		 */
		authorReference?: Reference;
		/**
		 * May contain extended information for property: 'authorReference'
		 */
		_authorReference?: Element;
		/**
		 * The individual responsible for making the annotation.
		 */
		authorString?: string;
		/**
		 * May contain extended information for property: 'authorString'
		 */
		_authorString?: Element;
		/**
		 * The text of the annotation in markdown format
		 */
		text: markdown;
		/**
		 * May contain extended information for property: 'text'
		 */
		_text?: Element;
		/**
		 * Indicates when this particular annotation was made
		 */
		time?: dateTime;
		/**
		 * May contain extended information for property: 'time'
		 */
		_time?: Element;
	}
	/**
	 * For referring to data content defined in other formats.
	 * From: attachment.xml
	 */
	export interface Attachment extends Element {
		/**
		 * Identifies the type of the data in the attachment and allows a method to be chosen to interpret or render the data. Includes mime type parameters such as charset where appropriate
		 */
		contentType?: code;
		/**
		 * May contain extended information for property: 'contentType'
		 */
		_contentType?: Element;
		/**
		 * The date that the attachment was first created
		 */
		creation?: dateTime;
		/**
		 * May contain extended information for property: 'creation'
		 */
		_creation?: Element;
		/**
		 * The actual data of the attachment - a sequence of bytes, base64 encoded
		 */
		data?: base64Binary;
		/**
		 * May contain extended information for property: 'data'
		 */
		_data?: Element;
		/**
		 * The calculated hash of the data using SHA-1. Represented using base64.
		 */
		hash?: base64Binary;
		/**
		 * May contain extended information for property: 'hash'
		 */
		_hash?: Element;
		/**
		 * The human language of the content. The value can be any valid value according to BCP 47
		 */
		language?: code;
		/**
		 * May contain extended information for property: 'language'
		 */
		_language?: Element;
		/**
		 * The number of bytes of data that make up this attachment (before base64 encoding, if that is done).
		 */
		size?: unsignedInt;
		/**
		 * May contain extended information for property: 'size'
		 */
		_size?: Element;
		/**
		 * A label or set of text to display in place of the data
		 */
		title?: string;
		/**
		 * May contain extended information for property: 'title'
		 */
		_title?: Element;
		/**
		 * A location where the data can be accessed
		 */
		url?: url;
		/**
		 * May contain extended information for property: 'url'
		 */
		_url?: Element;
	}
	/**
	 * Base definition for all elements that are defined inside a resource - but not those in a data type
	 * From: backboneelement.xml
	 */
	export interface BackboneElement extends Element {
		/**
		 * May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.
		 * 
		 * Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself)
		 */
		modifierExtension?: Extension[];
		/**
		 * May contain extended information for property: 'modifierExtension'
		 */
		_modifierExtension?: Element[];
	}
	/**
	 * A concept that may be defined by a formal reference to a terminology or ontology or may be provided by text
	 * From: codeableconcept.xml
	 */
	export interface CodeableConcept extends Element {
		/**
		 * A reference to a code defined by a terminology system 
		 */
		coding?: Coding[];
		/**
		 * May contain extended information for property: 'coding'
		 */
		_coding?: Element[];
		/**
		 * A human language representation of the concept as seen/selected/uttered by the user who entered the data and/or which represents the intended meaning of the user
		 */
		text?: string;
		/**
		 * May contain extended information for property: 'text'
		 */
		_text?: Element;
	}
	/**
	 * A reference to a code defined by a terminology system 
	 * From: coding.xml
	 */
	export interface Coding extends Element {
		/**
		 * A symbol in syntax defined by the system. The symbol may be a predefined code or an expression in a syntax defined by the coding system (e.g. post-coordination)
		 */
		code?: code;
		/**
		 * May contain extended information for property: 'code'
		 */
		_code?: Element;
		/**
		 * A representation of the meaning of the code in the system, following the rules of the system
		 */
		display?: string;
		/**
		 * May contain extended information for property: 'display'
		 */
		_display?: Element;
		/**
		 * The identification of the code system that defines the meaning of the symbol in the code. 
		 */
		system?: uri;
		/**
		 * May contain extended information for property: 'system'
		 */
		_system?: Element;
		/**
		 * Indicates that this coding was chosen by a user directly - e.g. off a pick list of available items (codes or displays)
		 */
		userSelected?: boolean;
		/**
		 * May contain extended information for property: 'userSelected'
		 */
		_userSelected?: Element;
		/**
		 * The version of the code system which was used when choosing this code. Note that a well-maintained code system does not need the version reported, because the meaning of codes is consistent across versions. However this cannot consistently be assured, and when the meaning is not guaranteed to be consistent, the version SHOULD be exchanged
		 */
		version?: string;
		/**
		 * May contain extended information for property: 'version'
		 */
		_version?: Element;
	}
	/**
	 * Specifies contact information for a person or organization
	 * From: contactdetail.xml
	 */
	export interface ContactDetail extends Element {
		/**
		 * The name of an individual to contact
		 */
		name?: string;
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element;
		/**
		 * The contact details for the individual (if a name was provided) or the organization
		 */
		telecom?: ContactPoint[];
		/**
		 * May contain extended information for property: 'telecom'
		 */
		_telecom?: Element[];
	}
	/**
	 * Details for all kinds of technology mediated contact points for a person or organization, including telephone, email, etc.
	 * From: contactpoint.xml
	 */
	export interface ContactPoint extends Element {
		/**
		 * Time period when the contact point was/is in use
		 */
		period?: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * Specifies a preferred order in which to use a set of contacts. ContactPoints with lower rank values are more preferred than those with higher rank values
		 */
		rank?: positiveInt;
		/**
		 * May contain extended information for property: 'rank'
		 */
		_rank?: Element;
		/**
		 * Telecommunications form for contact point - what communications system is required to make use of the contact
		 */
		system?: code;
		/**
		 * May contain extended information for property: 'system'
		 */
		_system?: Element;
		/**
		 * Identifies the purpose for the contact point
		 */
		use?: code;
		/**
		 * May contain extended information for property: 'use'
		 */
		_use?: Element;
		/**
		 * The actual contact point details, in a form that is meaningful to the designated communication system (i.e. phone number or email address).
		 */
		value?: string;
		/**
		 * May contain extended information for property: 'value'
		 */
		_value?: Element;
	}
	/**
	 * A contributor to the content of a knowledge asset, including authors, editors, reviewers, and endorsers
	 * From: contributor.xml
	 */
	export interface Contributor extends Element {
		/**
		 * Contact details to assist a user in finding and communicating with the contributor
		 */
		contact?: ContactDetail[];
		/**
		 * May contain extended information for property: 'contact'
		 */
		_contact?: Element[];
		/**
		 * The name of the individual or organization responsible for the contribution
		 */
		name: string;
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element;
		/**
		 * The type of contributor
		 */
		type: code;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
	}
	/**
	 * Describes a required data item for evaluation in terms of the type of data, and optional code or date-based filters of the data
	 * From: datarequirement.xml
	 */
	export interface DataRequirement extends Element {
		/**
		 * Code filters specify additional constraints on the data, specifying the value set of interest for a particular element of the data. Each code filter defines an additional constraint on the data, i.e. code filters are AND'ed, not OR'ed
		 */
		codeFilter?: DataRequirementCodeFilter[];
		/**
		 * May contain extended information for property: 'codeFilter'
		 */
		_codeFilter?: Element[];
		/**
		 * Date filters specify additional constraints on the data in terms of the applicable date range for specific elements. Each date filter specifies an additional constraint on the data, i.e. date filters are AND'ed, not OR'ed
		 */
		dateFilter?: DataRequirementDateFilter[];
		/**
		 * May contain extended information for property: 'dateFilter'
		 */
		_dateFilter?: Element[];
		/**
		 * Specifies a maximum number of results that are required (uses the _count search parameter)
		 */
		limit?: positiveInt;
		/**
		 * May contain extended information for property: 'limit'
		 */
		_limit?: Element;
		/**
		 * Indicates that specific elements of the type are referenced by the knowledge module and must be supported by the consumer in order to obtain an effective evaluation. This does not mean that a value is required for this element, only that the consuming system must understand the element and be able to provide values for it if they are available. 
		 * 
		 * The value of mustSupport SHALL be a FHIRPath resolveable on the type of the DataRequirement. The path SHALL consist only of identifiers, constant indexers, and .resolve() (see the [Simple FHIRPath Profile](fhirpath.html#simple) for full details)
		 */
		mustSupport?: string[];
		/**
		 * May contain extended information for property: 'mustSupport'
		 */
		_mustSupport?: Element[];
		/**
		 * The profile of the required data, specified as the uri of the profile definition
		 */
		profile?: canonical[];
		/**
		 * May contain extended information for property: 'profile'
		 */
		_profile?: Element[];
		/**
		 * Specifies the order of the results to be returned
		 */
		sort?: DataRequirementSort[];
		/**
		 * May contain extended information for property: 'sort'
		 */
		_sort?: Element[];
		/**
		 * The intended subjects of the data requirement. If this element is not provided, a Patient subject is assumed
		 */
		subjectCodeableConcept?: CodeableConcept;
		/**
		 * May contain extended information for property: 'subjectCodeableConcept'
		 */
		_subjectCodeableConcept?: Element;
		/**
		 * The intended subjects of the data requirement. If this element is not provided, a Patient subject is assumed
		 */
		subjectReference?: Reference;
		/**
		 * May contain extended information for property: 'subjectReference'
		 */
		_subjectReference?: Element;
		/**
		 * The type of the required data, specified as the type name of a resource. For profiles, this value is set to the type of the base resource of the profile
		 */
		type: code;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
	}
	/**
	 * Code filters specify additional constraints on the data, specifying the value set of interest for a particular element of the data. Each code filter defines an additional constraint on the data, i.e. code filters are AND'ed, not OR'ed
	 * From: datarequirement.xml
	 */
	export interface DataRequirementCodeFilter extends Element {
		/**
		 * The codes for the code filter. If values are given, the filter will return only those data items for which the code-valued attribute specified by the path has a value that is one of the specified codes. If codes are specified in addition to a value set, the filter returns items matching a code in the value set or one of the specified codes
		 */
		code?: Coding[];
		/**
		 * May contain extended information for property: 'code'
		 */
		_code?: Element[];
		/**
		 * The code-valued attribute of the filter. The specified path SHALL be a FHIRPath resolveable on the specified type of the DataRequirement, and SHALL consist only of identifiers, constant indexers, and .resolve(). The path is allowed to contain qualifiers (.) to traverse sub-elements, as well as indexers ([x]) to traverse multiple-cardinality sub-elements (see the [Simple FHIRPath Profile](fhirpath.html#simple) for full details). Note that the index must be an integer constant. The path must resolve to an element of type code, Coding, or CodeableConcept
		 */
		path?: string;
		/**
		 * May contain extended information for property: 'path'
		 */
		_path?: Element;
		/**
		 * A token parameter that refers to a search parameter defined on the specified type of the DataRequirement, and which searches on elements of type code, Coding, or CodeableConcept
		 */
		searchParam?: string;
		/**
		 * May contain extended information for property: 'searchParam'
		 */
		_searchParam?: Element;
		/**
		 * The valueset for the code filter. The valueSet and code elements are additive. If valueSet is specified, the filter will return only those data items for which the value of the code-valued element specified in the path is a member of the specified valueset
		 */
		valueSet?: canonical;
		/**
		 * May contain extended information for property: 'valueSet'
		 */
		_valueSet?: Element;
	}
	/**
	 * Date filters specify additional constraints on the data in terms of the applicable date range for specific elements. Each date filter specifies an additional constraint on the data, i.e. date filters are AND'ed, not OR'ed
	 * From: datarequirement.xml
	 */
	export interface DataRequirementDateFilter extends Element {
		/**
		 * The date-valued attribute of the filter. The specified path SHALL be a FHIRPath resolveable on the specified type of the DataRequirement, and SHALL consist only of identifiers, constant indexers, and .resolve(). The path is allowed to contain qualifiers (.) to traverse sub-elements, as well as indexers ([x]) to traverse multiple-cardinality sub-elements (see the [Simple FHIRPath Profile](fhirpath.html#simple) for full details). Note that the index must be an integer constant. The path must resolve to an element of type date, dateTime, Period, Schedule, or Timing
		 */
		path?: string;
		/**
		 * May contain extended information for property: 'path'
		 */
		_path?: Element;
		/**
		 * A date parameter that refers to a search parameter defined on the specified type of the DataRequirement, and which searches on elements of type date, dateTime, Period, Schedule, or Timing
		 */
		searchParam?: string;
		/**
		 * May contain extended information for property: 'searchParam'
		 */
		_searchParam?: Element;
		/**
		 * The value of the filter. If period is specified, the filter will return only those data items that fall within the bounds determined by the Period, inclusive of the period boundaries. If dateTime is specified, the filter will return only those data items that are equal to the specified dateTime. If a Duration is specified, the filter will return only those data items that fall within Duration before now
		 */
		valueDateTime?: dateTime;
		/**
		 * May contain extended information for property: 'valueDateTime'
		 */
		_valueDateTime?: Element;
		/**
		 * The value of the filter. If period is specified, the filter will return only those data items that fall within the bounds determined by the Period, inclusive of the period boundaries. If dateTime is specified, the filter will return only those data items that are equal to the specified dateTime. If a Duration is specified, the filter will return only those data items that fall within Duration before now
		 */
		valueDuration?: Duration;
		/**
		 * May contain extended information for property: 'valueDuration'
		 */
		_valueDuration?: Element;
		/**
		 * The value of the filter. If period is specified, the filter will return only those data items that fall within the bounds determined by the Period, inclusive of the period boundaries. If dateTime is specified, the filter will return only those data items that are equal to the specified dateTime. If a Duration is specified, the filter will return only those data items that fall within Duration before now
		 */
		valuePeriod?: Period;
		/**
		 * May contain extended information for property: 'valuePeriod'
		 */
		_valuePeriod?: Element;
	}
	/**
	 * Specifies the order of the results to be returned
	 * From: datarequirement.xml
	 */
	export interface DataRequirementSort extends Element {
		/**
		 * The direction of the sort, ascending or descending
		 */
		direction: code;
		/**
		 * May contain extended information for property: 'direction'
		 */
		_direction?: Element;
		/**
		 * The attribute of the sort. The specified path must be resolvable from the type of the required data. The path is allowed to contain qualifiers (.) to traverse sub-elements, as well as indexers ([x]) to traverse multiple-cardinality sub-elements. Note that the index must be an integer constant
		 */
		path: string;
		/**
		 * May contain extended information for property: 'path'
		 */
		_path?: Element;
	}
	/**
	 * Base definition for all elements in a resource
	 * From: element.xml
	 */
	export interface Element {
		/**
		 * May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension
		 */
		extension?: Extension[];
		/**
		 * May contain extended information for property: 'extension'
		 */
		_extension?: Element[];
		/**
		 * Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces
		 */
		id?: string;
		/**
		 * May contain extended information for property: 'id'
		 */
		_id?: Element;
	}
	/**
	 * A expression that is evaluated in a specified context and returns a value. The context of use of the expression must specify the context in which the expression is evaluated, and how the result of the expression is used
	 * From: expression.xml
	 */
	export interface Expression extends Element {
		/**
		 * A brief, natural language description of the condition that effectively communicates the intended semantics 
		 */
		description?: string;
		/**
		 * May contain extended information for property: 'description'
		 */
		_description?: Element;
		/**
		 * An expression in the specified language that returns a value
		 */
		expression?: string;
		/**
		 * May contain extended information for property: 'expression'
		 */
		_expression?: Element;
		/**
		 * The media type of the language for the expression
		 */
		language: code;
		/**
		 * May contain extended information for property: 'language'
		 */
		_language?: Element;
		/**
		 * A short name assigned to the expression to allow for multiple reuse of the expression in the context where it is defined
		 */
		name?: id;
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element;
		/**
		 * A URI that defines where the expression is found
		 */
		reference?: uri;
		/**
		 * May contain extended information for property: 'reference'
		 */
		_reference?: Element;
	}
	/**
	 * Optional Extension Element - found in all resources
	 * From: extension.xml
	 */
	export interface Extension extends Element {
		/**
		 * Source of the definition for the extension code - a logical name or a URL
		 */
		url: uri;
		/**
		 * May contain extended information for property: 'url'
		 */
		_url?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueActionDefinition?: Structure;
		/**
		 * May contain extended information for property: 'valueActionDefinition'
		 */
		_valueActionDefinition?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueActionDefinitionBehavior?: Element;
		/**
		 * May contain extended information for property: 'valueActionDefinitionBehavior'
		 */
		_valueActionDefinitionBehavior?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueActionDefinitionCustomization?: Element;
		/**
		 * May contain extended information for property: 'valueActionDefinitionCustomization'
		 */
		_valueActionDefinitionCustomization?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueActionDefinitionRelatedAction?: Element;
		/**
		 * May contain extended information for property: 'valueActionDefinitionRelatedAction'
		 */
		_valueActionDefinitionRelatedAction?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueAddress?: Address;
		/**
		 * May contain extended information for property: 'valueAddress'
		 */
		_valueAddress?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueAge?: Quantity;
		/**
		 * May contain extended information for property: 'valueAge'
		 */
		_valueAge?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueAnnotation?: Annotation;
		/**
		 * May contain extended information for property: 'valueAnnotation'
		 */
		_valueAnnotation?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueAttachment?: Attachment;
		/**
		 * May contain extended information for property: 'valueAttachment'
		 */
		_valueAttachment?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueBackboneElement?: Element;
		/**
		 * May contain extended information for property: 'valueBackboneElement'
		 */
		_valueBackboneElement?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueBase64Binary?: string;
		/**
		 * May contain extended information for property: 'valueBase64Binary'
		 */
		_valueBase64Binary?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueBoolean?: boolean;
		/**
		 * May contain extended information for property: 'valueBoolean'
		 */
		_valueBoolean?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueCanonical?: string;
		/**
		 * May contain extended information for property: 'valueCanonical'
		 */
		_valueCanonical?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueCode?: string;
		/**
		 * May contain extended information for property: 'valueCode'
		 */
		_valueCode?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueCodeableConcept?: CodeableConcept;
		/**
		 * May contain extended information for property: 'valueCodeableConcept'
		 */
		_valueCodeableConcept?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueCoding?: Coding;
		/**
		 * May contain extended information for property: 'valueCoding'
		 */
		_valueCoding?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueContactDetail?: ContactDetail;
		/**
		 * May contain extended information for property: 'valueContactDetail'
		 */
		_valueContactDetail?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueContactPoint?: ContactPoint;
		/**
		 * May contain extended information for property: 'valueContactPoint'
		 */
		_valueContactPoint?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueContributor?: Contributor;
		/**
		 * May contain extended information for property: 'valueContributor'
		 */
		_valueContributor?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueCount?: Quantity;
		/**
		 * May contain extended information for property: 'valueCount'
		 */
		_valueCount?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDataRequirement?: DataRequirement;
		/**
		 * May contain extended information for property: 'valueDataRequirement'
		 */
		_valueDataRequirement?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDataRequirementCodeFilter?: Element;
		/**
		 * May contain extended information for property: 'valueDataRequirementCodeFilter'
		 */
		_valueDataRequirementCodeFilter?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDataRequirementDateFilter?: Element;
		/**
		 * May contain extended information for property: 'valueDataRequirementDateFilter'
		 */
		_valueDataRequirementDateFilter?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDataRequirementSort?: Element;
		/**
		 * May contain extended information for property: 'valueDataRequirementSort'
		 */
		_valueDataRequirementSort?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDate?: string;
		/**
		 * May contain extended information for property: 'valueDate'
		 */
		_valueDate?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDateTime?: string;
		/**
		 * May contain extended information for property: 'valueDateTime'
		 */
		_valueDateTime?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDecimal?: number;
		/**
		 * May contain extended information for property: 'valueDecimal'
		 */
		_valueDecimal?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDistance?: Quantity;
		/**
		 * May contain extended information for property: 'valueDistance'
		 */
		_valueDistance?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDosage?: BackboneElement;
		/**
		 * May contain extended information for property: 'valueDosage'
		 */
		_valueDosage?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDosageDoseAndRate?: Element;
		/**
		 * May contain extended information for property: 'valueDosageDoseAndRate'
		 */
		_valueDosageDoseAndRate?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueDuration?: Quantity;
		/**
		 * May contain extended information for property: 'valueDuration'
		 */
		_valueDuration?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueElementDefinition?: BackboneElement;
		/**
		 * May contain extended information for property: 'valueElementDefinition'
		 */
		_valueElementDefinition?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueElementDefinitionBase?: Element;
		/**
		 * May contain extended information for property: 'valueElementDefinitionBase'
		 */
		_valueElementDefinitionBase?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueElementDefinitionBinding?: Element;
		/**
		 * May contain extended information for property: 'valueElementDefinitionBinding'
		 */
		_valueElementDefinitionBinding?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueElementDefinitionConstraint?: Element;
		/**
		 * May contain extended information for property: 'valueElementDefinitionConstraint'
		 */
		_valueElementDefinitionConstraint?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueElementDefinitionExample?: Element;
		/**
		 * May contain extended information for property: 'valueElementDefinitionExample'
		 */
		_valueElementDefinitionExample?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueElementDefinitionMapping?: Element;
		/**
		 * May contain extended information for property: 'valueElementDefinitionMapping'
		 */
		_valueElementDefinitionMapping?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueElementDefinitionSlicing?: Element;
		/**
		 * May contain extended information for property: 'valueElementDefinitionSlicing'
		 */
		_valueElementDefinitionSlicing?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueElementDefinitionSlicingDiscriminator?: Element;
		/**
		 * May contain extended information for property: 'valueElementDefinitionSlicingDiscriminator'
		 */
		_valueElementDefinitionSlicingDiscriminator?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueElementDefinitionType?: Element;
		/**
		 * May contain extended information for property: 'valueElementDefinitionType'
		 */
		_valueElementDefinitionType?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueExpression?: Element;
		/**
		 * May contain extended information for property: 'valueExpression'
		 */
		_valueExpression?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueExtension?: Extension;
		/**
		 * May contain extended information for property: 'valueExtension'
		 */
		_valueExtension?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueHumanName?: HumanName;
		/**
		 * May contain extended information for property: 'valueHumanName'
		 */
		_valueHumanName?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueId?: string;
		/**
		 * May contain extended information for property: 'valueId'
		 */
		_valueId?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueIdentifier?: Identifier;
		/**
		 * May contain extended information for property: 'valueIdentifier'
		 */
		_valueIdentifier?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueInstant?: string;
		/**
		 * May contain extended information for property: 'valueInstant'
		 */
		_valueInstant?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueInteger?: number;
		/**
		 * May contain extended information for property: 'valueInteger'
		 */
		_valueInteger?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueMarkdown?: string;
		/**
		 * May contain extended information for property: 'valueMarkdown'
		 */
		_valueMarkdown?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueMarketingStatus?: BackboneElement;
		/**
		 * May contain extended information for property: 'valueMarketingStatus'
		 */
		_valueMarketingStatus?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueMeta?: Element;
		/**
		 * May contain extended information for property: 'valueMeta'
		 */
		_valueMeta?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueModuleMetadata?: ModuleMetadata;
		/**
		 * May contain extended information for property: 'valueModuleMetadata'
		 */
		_valueModuleMetadata?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueMoney?: Money;
		/**
		 * May contain extended information for property: 'valueMoney'
		 */
		_valueMoney?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueNarrative?: Narrative;
		/**
		 * May contain extended information for property: 'valueNarrative'
		 */
		_valueNarrative?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueOid?: string;
		/**
		 * May contain extended information for property: 'valueOid'
		 */
		_valueOid?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueParameterDefinition?: ParameterDefinition;
		/**
		 * May contain extended information for property: 'valueParameterDefinition'
		 */
		_valueParameterDefinition?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valuePeriod?: Period;
		/**
		 * May contain extended information for property: 'valuePeriod'
		 */
		_valuePeriod?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valuePopulation?: BackboneElement;
		/**
		 * May contain extended information for property: 'valuePopulation'
		 */
		_valuePopulation?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valuePositiveInt?: number;
		/**
		 * May contain extended information for property: 'valuePositiveInt'
		 */
		_valuePositiveInt?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueProdCharacteristic?: BackboneElement;
		/**
		 * May contain extended information for property: 'valueProdCharacteristic'
		 */
		_valueProdCharacteristic?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueProductShelfLife?: BackboneElement;
		/**
		 * May contain extended information for property: 'valueProductShelfLife'
		 */
		_valueProductShelfLife?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueQuantity?: Quantity;
		/**
		 * May contain extended information for property: 'valueQuantity'
		 */
		_valueQuantity?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueRange?: Range;
		/**
		 * May contain extended information for property: 'valueRange'
		 */
		_valueRange?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueRatio?: Ratio;
		/**
		 * May contain extended information for property: 'valueRatio'
		 */
		_valueRatio?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueReference?: Reference;
		/**
		 * May contain extended information for property: 'valueReference'
		 */
		_valueReference?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueRelatedArtifact?: RelatedArtifact;
		/**
		 * May contain extended information for property: 'valueRelatedArtifact'
		 */
		_valueRelatedArtifact?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueSampledData?: SampledData;
		/**
		 * May contain extended information for property: 'valueSampledData'
		 */
		_valueSampledData?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueSignature?: Signature;
		/**
		 * May contain extended information for property: 'valueSignature'
		 */
		_valueSignature?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueString?: string;
		/**
		 * May contain extended information for property: 'valueString'
		 */
		_valueString?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueSubstanceAmount?: BackboneElement;
		/**
		 * May contain extended information for property: 'valueSubstanceAmount'
		 */
		_valueSubstanceAmount?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueSubstanceAmountReferenceRange?: Element;
		/**
		 * May contain extended information for property: 'valueSubstanceAmountReferenceRange'
		 */
		_valueSubstanceAmountReferenceRange?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueSubstanceMoiety?: BackboneElement;
		/**
		 * May contain extended information for property: 'valueSubstanceMoiety'
		 */
		_valueSubstanceMoiety?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueTime?: string;
		/**
		 * May contain extended information for property: 'valueTime'
		 */
		_valueTime?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueTiming?: BackboneElement;
		/**
		 * May contain extended information for property: 'valueTiming'
		 */
		_valueTiming?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueTimingRepeat?: Element;
		/**
		 * May contain extended information for property: 'valueTimingRepeat'
		 */
		_valueTimingRepeat?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueTriggerDefinition?: TriggerDefinition;
		/**
		 * May contain extended information for property: 'valueTriggerDefinition'
		 */
		_valueTriggerDefinition?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueUnsignedInt?: number;
		/**
		 * May contain extended information for property: 'valueUnsignedInt'
		 */
		_valueUnsignedInt?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueUri?: string;
		/**
		 * May contain extended information for property: 'valueUri'
		 */
		_valueUri?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueUrl?: string;
		/**
		 * May contain extended information for property: 'valueUrl'
		 */
		_valueUrl?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueUsageContext?: UsageContext;
		/**
		 * May contain extended information for property: 'valueUsageContext'
		 */
		_valueUsageContext?: Element;
		/**
		 * Value of extension - must be one of a constrained set of the data types (see [Extensibility](extensibility.html) for a list)
		 */
		valueUuid?: string;
		/**
		 * May contain extended information for property: 'valueUuid'
		 */
		_valueUuid?: Element;
	}
	/**
	 * A human's name with the ability to identify parts and usage
	 * From: humanname.xml
	 */
	export interface HumanName extends Element {
		/**
		 * The part of a name that links to the genealogy. In some cultures (e.g. Eritrea) the family name of a son is the first name of his father.
		 */
		family?: string;
		/**
		 * May contain extended information for property: 'family'
		 */
		_family?: Element;
		/**
		 * Given name
		 */
		given?: string[];
		/**
		 * May contain extended information for property: 'given'
		 */
		_given?: Element[];
		/**
		 * Indicates the period of time when this name was valid for the named person.
		 */
		period?: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * Part of the name that is acquired as a title due to academic, legal, employment or nobility status, etc. and that appears at the start of the name
		 */
		prefix?: string[];
		/**
		 * May contain extended information for property: 'prefix'
		 */
		_prefix?: Element[];
		/**
		 * Part of the name that is acquired as a title due to academic, legal, employment or nobility status, etc. and that appears at the end of the name
		 */
		suffix?: string[];
		/**
		 * May contain extended information for property: 'suffix'
		 */
		_suffix?: Element[];
		/**
		 * Specifies the entire name as it should be displayed e.g. on an application UI. This may be provided instead of or as well as the specific parts
		 */
		text?: string;
		/**
		 * May contain extended information for property: 'text'
		 */
		_text?: Element;
		/**
		 * Identifies the purpose for this name
		 */
		use?: code;
		/**
		 * May contain extended information for property: 'use'
		 */
		_use?: Element;
	}
	/**
	 * An identifier - identifies some entity uniquely and unambiguously. Typically this is used for business identifiers
	 * From: identifier.xml
	 */
	export interface Identifier extends Element {
		/**
		 * Organization that issued/manages the identifier
		 */
		assigner?: Reference;
		/**
		 * May contain extended information for property: 'assigner'
		 */
		_assigner?: Element;
		/**
		 * Time period during which identifier is/was valid for use
		 */
		period?: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * Establishes the namespace for the value - that is, a URL that describes a set values that are unique.
		 */
		system?: uri;
		/**
		 * May contain extended information for property: 'system'
		 */
		_system?: Element;
		/**
		 * A coded type for the identifier that can be used to determine which identifier to use for a specific purpose
		 */
		type?: CodeableConcept;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
		/**
		 * The purpose of this identifier
		 */
		use?: code;
		/**
		 * May contain extended information for property: 'use'
		 */
		_use?: Element;
		/**
		 * The portion of the identifier typically relevant to the user and which is unique within the context of the system
		 */
		value?: string;
		/**
		 * May contain extended information for property: 'value'
		 */
		_value?: Element;
	}
	/**
	 * The metadata about a resource. This is content in the resource that is maintained by the infrastructure. Changes to the content might not always be associated with version changes to the resource
	 * From: meta.xml
	 */
	export interface Meta extends Element {
		/**
		 * When the resource last changed - e.g. when the version changed
		 */
		lastUpdated?: instant;
		/**
		 * May contain extended information for property: 'lastUpdated'
		 */
		_lastUpdated?: Element;
		/**
		 * A list of profiles (references to [[[StructureDefinition]]] resources) that this resource claims to conform to. The URL is a reference to [[[StructureDefinition.url]]]
		 */
		profile?: canonical[];
		/**
		 * May contain extended information for property: 'profile'
		 */
		_profile?: Element[];
		/**
		 * Security labels applied to this resource. These tags connect specific resources to the overall security policy and infrastructure
		 */
		security?: Coding[];
		/**
		 * May contain extended information for property: 'security'
		 */
		_security?: Element[];
		/**
		 * A uri that identifies the source system of the resource. This provides a minimal amount of [[[Provenance]]] information that can be used to track or differentiate the source of information in the resource. The source may identify another FHIR server, document, message, database, etc.
		 */
		source?: uri;
		/**
		 * May contain extended information for property: 'source'
		 */
		_source?: Element;
		/**
		 * Tags applied to this resource. Tags are intended to be used to identify and relate resources to process and workflow, and applications are not required to consider the tags when interpreting the meaning of a resource
		 */
		tag?: Coding[];
		/**
		 * May contain extended information for property: 'tag'
		 */
		_tag?: Element[];
		/**
		 * The version specific identifier, as it appears in the version portion of the URL. This value changes when the resource is created, updated, or deleted
		 */
		versionId?: id;
		/**
		 * May contain extended information for property: 'versionId'
		 */
		_versionId?: Element;
	}
	/**
	 * The ModuleMetadata structure defines the common metadata elements used by quality improvement artifacts. This information includes descriptive and topical metadata to enable repository searches, as well as governance and evidentiary support information
	 * From: modulemetadata.xml
	 */
	export interface ModuleMetadata extends Element {
		/**
		 * Contact details to assist a user in finding and communicating with the publisher
		 */
		contact?: ContactDetail[];
		/**
		 * May contain extended information for property: 'contact'
		 */
		_contact?: Element[];
		/**
		 * A contributor to the content of the module, including authors, editors, reviewers, and endorsers
		 */
		contributor?: Contributor[];
		/**
		 * May contain extended information for property: 'contributor'
		 */
		_contributor?: Element[];
		/**
		 * A copyright statement relating to the module and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the module
		 */
		copyright?: string;
		/**
		 * May contain extended information for property: 'copyright'
		 */
		_copyright?: Element;
		/**
		 * Specifies various attributes of the patient population for whom and/or environment of care in which the knowledge module is applicable
		 */
		coverage?: UsageContext[];
		/**
		 * May contain extended information for property: 'coverage'
		 */
		_coverage?: Element[];
		/**
		 * A free text natural language description of the module from the consumer's perspective
		 */
		description?: string;
		/**
		 * May contain extended information for property: 'description'
		 */
		_description?: Element;
		/**
		 * The period during which the module content is effective
		 */
		effectivePeriod?: Period;
		/**
		 * May contain extended information for property: 'effectivePeriod'
		 */
		_effectivePeriod?: Element;
		/**
		 * Determines whether the module was developed for testing purposes (or education/evaluation/marketing), and is not intended to be used in production environments
		 */
		experimental?: boolean;
		/**
		 * May contain extended information for property: 'experimental'
		 */
		_experimental?: Element;
		/**
		 * A logical identifier for the module such as the CMS or NQF identifiers for a measure artifact. Note that at least one identifier is required for non-experimental active artifacts
		 */
		identifier?: Identifier[];
		/**
		 * May contain extended information for property: 'identifier'
		 */
		_identifier?: Element[];
		/**
		 * The date on which the module content was last reviewed
		 */
		lastReviewDate?: date;
		/**
		 * May contain extended information for property: 'lastReviewDate'
		 */
		_lastReviewDate?: Element;
		/**
		 * A machine-friendly name for the module. This name should be usable as an identifier for the module by machine processing applications such as code generation
		 */
		name?: string;
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element;
		/**
		 * The date on which the module was published
		 */
		publicationDate?: date;
		/**
		 * May contain extended information for property: 'publicationDate'
		 */
		_publicationDate?: Element;
		/**
		 * The name of the individual or organization that published the module (also known as the steward for the module). This information is required for non-experimental published artifacts
		 */
		publisher?: string;
		/**
		 * May contain extended information for property: 'publisher'
		 */
		_publisher?: Element;
		/**
		 * A brief description of the purpose of the module
		 */
		purpose?: string;
		/**
		 * May contain extended information for property: 'purpose'
		 */
		_purpose?: Element;
		/**
		 * Related resources such as additional documentation, justification, or bibliographic references
		 */
		relatedArtifact?: RelatedArtifact[];
		/**
		 * May contain extended information for property: 'relatedArtifact'
		 */
		_relatedArtifact?: Element[];
		/**
		 * The status of the module
		 */
		status: code;
		/**
		 * May contain extended information for property: 'status'
		 */
		_status?: Element;
		/**
		 * A short, descriptive, user-friendly title for the module
		 */
		title?: string;
		/**
		 * May contain extended information for property: 'title'
		 */
		_title?: Element;
		/**
		 * Clinical topics related to the content of the module
		 */
		topic?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'topic'
		 */
		_topic?: Element[];
		/**
		 * Identifies the type of knowledge module, such as a rule, library, documentation template, or measure
		 */
		type: code;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
		/**
		 * An absolute URL that is used to identify this module when it is referenced. This SHALL be a URL, SHOULD be globally unique, and SHOULD be an address at which this module definition is (or will be) published
		 */
		url?: uri;
		/**
		 * May contain extended information for property: 'url'
		 */
		_url?: Element;
		/**
		 * A detailed description of how the module is used from a clinical perspective
		 */
		usage?: string;
		/**
		 * May contain extended information for property: 'usage'
		 */
		_usage?: Element;
		/**
		 * The version of the module, if any. To provide a version consistent with the Decision Support Service specification, use the format Major.Minor.Revision (e.g. 1.0.0). For more information on versioning knowledge modules, refer to the Decision Support Service specification. Note that a version is required for non-experimental active artifacts
		 */
		version?: string;
		/**
		 * May contain extended information for property: 'version'
		 */
		_version?: Element;
	}
	/**
	 * An amount of economic utility in some recognized currency
	 * From: money.xml
	 */
	export interface Money extends Element {
		/**
		 * ISO 4217 Currency Code
		 */
		currency?: code;
		/**
		 * May contain extended information for property: 'currency'
		 */
		_currency?: Element;
		/**
		 * Numerical value (with implicit precision)
		 */
		value?: decimal;
		/**
		 * May contain extended information for property: 'value'
		 */
		_value?: Element;
	}
	/**
	 * A human-readable summary of the resource conveying the essential clinical and business information for the resource
	 * From: narrative.xml
	 */
	export interface Narrative extends Element {
		/**
		 * The actual narrative content, a stripped down version of XHTML
		 */
		div: xhtml;
		/**
		 * May contain extended information for property: 'div'
		 */
		_div?: Element;
		/**
		 * The status of the narrative - whether it's entirely generated (from just the defined data or the extensions too), or whether a human authored it and it may contain additional data
		 */
		status: code;
		/**
		 * May contain extended information for property: 'status'
		 */
		_status?: Element;
	}
	/**
	 * The parameters to the module. This collection specifies both the input and output parameters. Input parameters are provided by the caller as part of the $evaluate operation. Output parameters are included in the GuidanceResponse
	 * From: parameterdefinition.xml
	 */
	export interface ParameterDefinition extends Element {
		/**
		 * A brief discussion of what the parameter is for and how it is used by the module
		 */
		documentation?: string;
		/**
		 * May contain extended information for property: 'documentation'
		 */
		_documentation?: Element;
		/**
		 * The maximum number of times this element is permitted to appear in the request or response
		 */
		max?: string;
		/**
		 * May contain extended information for property: 'max'
		 */
		_max?: Element;
		/**
		 * The minimum number of times this parameter SHALL appear in the request or response
		 */
		min?: integer;
		/**
		 * May contain extended information for property: 'min'
		 */
		_min?: Element;
		/**
		 * The name of the parameter used to allow access to the value of the parameter in evaluation contexts
		 */
		name?: code;
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element;
		/**
		 * If specified, this indicates a profile that the input data must conform to, or that the output data will conform to
		 */
		profile?: canonical;
		/**
		 * May contain extended information for property: 'profile'
		 */
		_profile?: Element;
		/**
		 * The type of the parameter
		 */
		type: code;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
		/**
		 * Whether the parameter is input or output for the module
		 */
		use: code;
		/**
		 * May contain extended information for property: 'use'
		 */
		_use?: Element;
	}
	/**
	 * A time period defined by a start and end date and optionally time.
	 * From: period.xml
	 */
	export interface Period extends Element {
		/**
		 * The end of the period. If the end of the period is missing, it means no end was known or planned at the time the instance was created. The start may be in the past, and the end date in the future, which means that period is expected/planned to end at that time
		 */
		end?: dateTime;
		/**
		 * May contain extended information for property: 'end'
		 */
		_end?: Element;
		/**
		 * The start of the period. The boundary is inclusive.
		 */
		start?: dateTime;
		/**
		 * May contain extended information for property: 'start'
		 */
		_start?: Element;
	}
	/**
	 * A measured amount (or an amount that can potentially be measured). Note that measured amounts include amounts that are not precisely quantified, including amounts involving arbitrary units and floating currencies
	 * From: quantity.xml
	 */
	export interface Quantity extends Element {
		/**
		 * A computer processable form of the unit in some unit representation system
		 */
		code?: code;
		/**
		 * May contain extended information for property: 'code'
		 */
		_code?: Element;
		/**
		 * How the value should be understood and represented - whether the actual value is greater or less than the stated value due to measurement issues; e.g. if the comparator is "<" , then the real value is < stated value
		 */
		comparator?: code;
		/**
		 * May contain extended information for property: 'comparator'
		 */
		_comparator?: Element;
		/**
		 * The identification of the system that provides the coded form of the unit
		 */
		system?: uri;
		/**
		 * May contain extended information for property: 'system'
		 */
		_system?: Element;
		/**
		 * A human-readable form of the unit
		 */
		unit?: string;
		/**
		 * May contain extended information for property: 'unit'
		 */
		_unit?: Element;
		/**
		 * The value of the measured amount. The value includes an implicit precision in the presentation of the value
		 */
		value?: decimal;
		/**
		 * May contain extended information for property: 'value'
		 */
		_value?: Element;
	}
	/**
	 * A set of ordered Quantities defined by a low and high limit. 
	 * From: range.xml
	 */
	export interface Range extends Element {
		/**
		 * The high limit. The boundary is inclusive. 
		 */
		high?: SimpleQuantity;
		/**
		 * May contain extended information for property: 'high'
		 */
		_high?: Element;
		/**
		 * The low limit. The boundary is inclusive.
		 */
		low?: SimpleQuantity;
		/**
		 * May contain extended information for property: 'low'
		 */
		_low?: Element;
	}
	/**
	 * A relationship of two Quantity values - expressed as a numerator and a denominator. 
	 * From: ratio.xml
	 */
	export interface Ratio extends Element {
		/**
		 * The value of the denominator
		 */
		denominator?: Quantity;
		/**
		 * May contain extended information for property: 'denominator'
		 */
		_denominator?: Element;
		/**
		 * The value of the numerator
		 */
		numerator?: Quantity;
		/**
		 * May contain extended information for property: 'numerator'
		 */
		_numerator?: Element;
	}
	/**
	 * A reference from one resource to another
	 * From: reference.xml
	 */
	export interface Reference extends Element {
		/**
		 * Plain text narrative that identifies the resource in addition to the resource reference 
		 */
		display?: string;
		/**
		 * May contain extended information for property: 'display'
		 */
		_display?: Element;
		/**
		 * An identifier for the target resource. This is used when there is no way to reference the other resource directly, either because the entity it represents is not available through a FHIR server, or because there is no way for the author of the resource to convert a known identifier to an actual location. There is no requirement that a Reference.identifier point to something that is actually exposed as a FHIR instance, but it SHALL point to a business concept that would be expected to be exposed as a FHIR instance, and that instance would need to be of a FHIR resource type allowed by the reference
		 */
		identifier?: Identifier;
		/**
		 * May contain extended information for property: 'identifier'
		 */
		_identifier?: Element;
		/**
		 * A reference to a location at which the other resource is found. The reference may be a relative reference, in which case it is relative to the service base URL, or an absolute URL that resolves to the location where the resource is found. The reference may be version specific or not. If the reference is not to a FHIR RESTful server, then it should be assumed to be version specific. Internal fragment references (start with '#') refer to contained resources
		 */
		reference?: string;
		/**
		 * May contain extended information for property: 'reference'
		 */
		_reference?: Element;
		/**
		 * The expected type of the target of the reference. If both Reference.type and Reference.reference are populated and Reference.reference is a FHIR URL, both SHALL be consistent.
		 * 
		 * The type is the Canonical URL of Resource Definition that is the type this reference refers to. References are URLs that are relative to http://hl7.org/fhir/StructureDefinition/ e.g. "Patient" is a reference to http://hl7.org/fhir/StructureDefinition/Patient. Absolute URLs are only allowed for logical models (and can only be used in references in logical models, not resources)
		 */
		type?: uri;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
	}
	/**
	 * Related artifacts such as additional documentation, justification, or bibliographic references
	 * From: relatedartifact.xml
	 */
	export interface RelatedArtifact extends Element {
		/**
		 * A bibliographic citation for the related artifact. This text SHOULD be formatted according to an accepted citation format
		 */
		citation?: markdown;
		/**
		 * May contain extended information for property: 'citation'
		 */
		_citation?: Element;
		/**
		 * A brief description of the document or knowledge resource being referenced, suitable for display to a consumer
		 */
		display?: string;
		/**
		 * May contain extended information for property: 'display'
		 */
		_display?: Element;
		/**
		 * The document being referenced, represented as an attachment. This is exclusive with the resource element
		 */
		document?: Attachment;
		/**
		 * May contain extended information for property: 'document'
		 */
		_document?: Element;
		/**
		 * A short label that can be used to reference the citation from elsewhere in the containing artifact, such as a footnote index
		 */
		label?: string;
		/**
		 * May contain extended information for property: 'label'
		 */
		_label?: Element;
		/**
		 * The related resource, such as a library, value set, profile, or other knowledge resource
		 */
		resource?: canonical;
		/**
		 * May contain extended information for property: 'resource'
		 */
		_resource?: Element;
		/**
		 * The type of relationship to the related artifact
		 */
		type: code;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
		/**
		 * A url for the artifact that can be followed to access the actual content
		 */
		url?: url;
		/**
		 * May contain extended information for property: 'url'
		 */
		_url?: Element;
	}
	/**
	 * A series of measurements taken by a device, with upper and lower limits. There may be more than one dimension in the data
	 * From: sampleddata.xml
	 */
	export interface SampledData extends Element {
		/**
		 * A series of data points which are decimal values separated by a single space (character u20). The special values "E" (error), "L" (below detection limit) and "U" (above detection limit) can also be used in place of a decimal value
		 */
		data?: string;
		/**
		 * May contain extended information for property: 'data'
		 */
		_data?: Element;
		/**
		 * The number of sample points at each time point. If this value is greater than one, then the dimensions will be interlaced - all the sample points for a point in time will be recorded at once
		 */
		dimensions: positiveInt;
		/**
		 * May contain extended information for property: 'dimensions'
		 */
		_dimensions?: Element;
		/**
		 * A correction factor that is applied to the sampled data points before they are added to the origin
		 */
		factor?: decimal;
		/**
		 * May contain extended information for property: 'factor'
		 */
		_factor?: Element;
		/**
		 * The lower limit of detection of the measured points. This is needed if any of the data points have the value "L" (lower than detection limit)
		 */
		lowerLimit?: decimal;
		/**
		 * May contain extended information for property: 'lowerLimit'
		 */
		_lowerLimit?: Element;
		/**
		 * The base quantity that a measured value of zero represents. In addition, this provides the units of the entire measurement series
		 */
		origin: SimpleQuantity;
		/**
		 * May contain extended information for property: 'origin'
		 */
		_origin?: Element;
		/**
		 * The length of time between sampling times, measured in milliseconds
		 */
		period: decimal;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * The upper limit of detection of the measured points. This is needed if any of the data points have the value "U" (higher than detection limit)
		 */
		upperLimit?: decimal;
		/**
		 * May contain extended information for property: 'upperLimit'
		 */
		_upperLimit?: Element;
	}
	/**
	 * A signature along with supporting context. The signature may be a digital signature that is cryptographic in nature, or some other signature acceptable to the domain. This other signature may be as simple as a graphical image representing a hand-written signature, or a signature ceremony Different signature approaches have different utilities.
	 * From: signature.xml
	 */
	export interface Signature extends Element {
		/**
		 * The base64 encoding of the Signature content. When signature is not recorded electronically this element would be empty.
		 */
		data?: base64Binary;
		/**
		 * May contain extended information for property: 'data'
		 */
		_data?: Element;
		/**
		 * A reference to an application-usable description of the identity that is represented by the signature.
		 */
		onBehalfOf?: Reference;
		/**
		 * May contain extended information for property: 'onBehalfOf'
		 */
		_onBehalfOf?: Element;
		/**
		 * A mime type that indicates the technical format of the signature. Important mime types are application/signature+xml for X ML DigSig, application/jose for JWS, and image/* for a graphical image of a signature, etc.
		 */
		sigFormat?: code;
		/**
		 * May contain extended information for property: 'sigFormat'
		 */
		_sigFormat?: Element;
		/**
		 * A mime type that indicates the technical format of the target resources signed by the signature.
		 */
		targetFormat?: code;
		/**
		 * May contain extended information for property: 'targetFormat'
		 */
		_targetFormat?: Element;
		/**
		 * An indication of the reason that the entity signed this document. This may be explicitly included as part of the signature information and can be used when determining accountability for various actions concerning the document. 
		 */
		type: Coding[];
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element[];
		/**
		 * When the digital signature was signed. 
		 */
		when: instant;
		/**
		 * May contain extended information for property: 'when'
		 */
		_when?: Element;
		/**
		 * A reference to an application-usable description of the identity that signed  (e.g. the signature used their private key)
		 */
		who: Reference;
		/**
		 * May contain extended information for property: 'who'
		 */
		_who?: Element;
	}
	/**
	 * Specifies an event that may occur multiple times. Timing schedules are used to record when things are planned, expected or requested to occur. The most common usage is in dosage instructions for medications. They are also used when planning care of various kinds, and may be used for reporting the schedule to which past regular activities were carried out
	 * From: timing.xml
	 */
	export interface Timing extends BackboneElement {
		/**
		 * A code for the timing schedule (or just text in code.text). Some codes such as BID are ubiquitous, but many institutions define their own additional codes. If a code is provided, the code is understood to be a complete statement of whatever is specified in the structured timing data, and either the code or the data may be used to interpret the Timing, with the exception that .repeat.bounds still applies over the code (and is not contained in the code)
		 */
		code?: CodeableConcept;
		/**
		 * May contain extended information for property: 'code'
		 */
		_code?: Element;
		/**
		 * Identifies specific times when the event occurs
		 */
		event?: dateTime[];
		/**
		 * May contain extended information for property: 'event'
		 */
		_event?: Element[];
		/**
		 * A set of rules that describe when the event is scheduled
		 */
		repeat?: TimingRepeat;
		/**
		 * May contain extended information for property: 'repeat'
		 */
		_repeat?: Element;
	}
	/**
	 * A set of rules that describe when the event is scheduled
	 * From: timing.xml
	 */
	export interface TimingRepeat extends Element {
		/**
		 * Either a duration for the length of the timing schedule, a range of possible length, or outer bounds for start and/or end limits of the timing schedule
		 */
		boundsDuration?: Duration;
		/**
		 * May contain extended information for property: 'boundsDuration'
		 */
		_boundsDuration?: Element;
		/**
		 * Either a duration for the length of the timing schedule, a range of possible length, or outer bounds for start and/or end limits of the timing schedule
		 */
		boundsPeriod?: Period;
		/**
		 * May contain extended information for property: 'boundsPeriod'
		 */
		_boundsPeriod?: Element;
		/**
		 * Either a duration for the length of the timing schedule, a range of possible length, or outer bounds for start and/or end limits of the timing schedule
		 */
		boundsRange?: Range;
		/**
		 * May contain extended information for property: 'boundsRange'
		 */
		_boundsRange?: Element;
		/**
		 * A total count of the desired number of repetitions across the duration of the entire timing specification. If countMax is present, this element indicates the lower bound of the allowed range of count values
		 */
		count?: positiveInt;
		/**
		 * May contain extended information for property: 'count'
		 */
		_count?: Element;
		/**
		 * If present, indicates that the count is a range - so to perform the action between [count] and [countMax] times
		 */
		countMax?: positiveInt;
		/**
		 * May contain extended information for property: 'countMax'
		 */
		_countMax?: Element;
		/**
		 * If one or more days of week is provided, then the action happens only on the specified day(s)
		 */
		dayOfWeek?: code[];
		/**
		 * May contain extended information for property: 'dayOfWeek'
		 */
		_dayOfWeek?: Element[];
		/**
		 * How long this thing happens for when it happens. If durationMax is present, this element indicates the lower bound of the allowed range of the duration
		 */
		duration?: decimal;
		/**
		 * May contain extended information for property: 'duration'
		 */
		_duration?: Element;
		/**
		 * If present, indicates that the duration is a range - so to perform the action between [duration] and [durationMax] time length
		 */
		durationMax?: decimal;
		/**
		 * May contain extended information for property: 'durationMax'
		 */
		_durationMax?: Element;
		/**
		 * The units of time for the duration, in UCUM units
		 */
		durationUnit?: code;
		/**
		 * May contain extended information for property: 'durationUnit'
		 */
		_durationUnit?: Element;
		/**
		 * The number of times to repeat the action within the specified period. If frequencyMax is present, this element indicates the lower bound of the allowed range of the frequency
		 */
		frequency?: positiveInt;
		/**
		 * May contain extended information for property: 'frequency'
		 */
		_frequency?: Element;
		/**
		 * If present, indicates that the frequency is a range - so to repeat between [frequency] and [frequencyMax] times within the period or period range
		 */
		frequencyMax?: positiveInt;
		/**
		 * May contain extended information for property: 'frequencyMax'
		 */
		_frequencyMax?: Element;
		/**
		 * The number of minutes from the event. If the event code does not indicate whether the minutes is before or after the event, then the offset is assumed to be after the event
		 */
		offset?: unsignedInt;
		/**
		 * May contain extended information for property: 'offset'
		 */
		_offset?: Element;
		/**
		 * Indicates the duration of time over which repetitions are to occur; e.g. to express "3 times per day", 3 would be the frequency and "1 day" would be the period. If periodMax is present, this element indicates the lower bound of the allowed range of the period length
		 */
		period?: decimal;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * If present, indicates that the period is a range from [period] to [periodMax], allowing expressing concepts such as "do this once every 3-5 days
		 */
		periodMax?: decimal;
		/**
		 * May contain extended information for property: 'periodMax'
		 */
		_periodMax?: Element;
		/**
		 * The units of time for the period in UCUM units
		 */
		periodUnit?: code;
		/**
		 * May contain extended information for property: 'periodUnit'
		 */
		_periodUnit?: Element;
		/**
		 * Specified time of day for action to take place
		 */
		timeOfDay?: time[];
		/**
		 * May contain extended information for property: 'timeOfDay'
		 */
		_timeOfDay?: Element[];
		/**
		 * An approximate time period during the day, potentially linked to an event of daily living that indicates when the action should occur
		 */
		when?: code[];
		/**
		 * May contain extended information for property: 'when'
		 */
		_when?: Element[];
	}
	/**
	 * A description of a triggering event. Triggering events can be named events, data events, or periodic, as determined by the type element
	 * From: triggerdefinition.xml
	 */
	export interface TriggerDefinition extends Element {
		/**
		 * A boolean-valued expression that is evaluated in the context of the container of the trigger definition and returns whether or not the trigger fires
		 */
		condition?: Expression;
		/**
		 * May contain extended information for property: 'condition'
		 */
		_condition?: Element;
		/**
		 * The triggering data of the event (if this is a data trigger). If more than one data is requirement is specified, then all the data requirements must be true
		 */
		data?: DataRequirement[];
		/**
		 * May contain extended information for property: 'data'
		 */
		_data?: Element[];
		/**
		 * A formal name for the event. This may be an absolute URI that identifies the event formally (e.g. from a trigger registry), or a simple relative URI that identifies the event in a local context
		 */
		name?: string;
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element;
		/**
		 * The timing of the event (if this is a periodic trigger)
		 */
		timingDate?: date;
		/**
		 * May contain extended information for property: 'timingDate'
		 */
		_timingDate?: Element;
		/**
		 * The timing of the event (if this is a periodic trigger)
		 */
		timingDateTime?: dateTime;
		/**
		 * May contain extended information for property: 'timingDateTime'
		 */
		_timingDateTime?: Element;
		/**
		 * The timing of the event (if this is a periodic trigger)
		 */
		timingReference?: Reference;
		/**
		 * May contain extended information for property: 'timingReference'
		 */
		_timingReference?: Element;
		/**
		 * The timing of the event (if this is a periodic trigger)
		 */
		timingTiming?: Timing;
		/**
		 * May contain extended information for property: 'timingTiming'
		 */
		_timingTiming?: Element;
		/**
		 * The type of triggering event
		 */
		type: code;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
	}
	/**
	 * Specifies clinical/business/etc. metadata that can be used to retrieve, index and/or categorize an artifact. This metadata can either be specific to the applicable population (e.g., age category, DRG) or the specific context of care (e.g., venue, care setting, provider of care)
	 * From: usagecontext.xml
	 */
	export interface UsageContext extends Element {
		/**
		 * A code that identifies the type of context being specified by this usage context
		 */
		code: Coding;
		/**
		 * May contain extended information for property: 'code'
		 */
		_code?: Element;
		/**
		 * A value that defines the context specified in this context of use. The interpretation of the value is defined by the code
		 */
		valueCodeableConcept: CodeableConcept;
		/**
		 * May contain extended information for property: 'valueCodeableConcept'
		 */
		_valueCodeableConcept?: Element;
		/**
		 * A value that defines the context specified in this context of use. The interpretation of the value is defined by the code
		 */
		valueQuantity: Quantity;
		/**
		 * May contain extended information for property: 'valueQuantity'
		 */
		_valueQuantity?: Element;
		/**
		 * A value that defines the context specified in this context of use. The interpretation of the value is defined by the code
		 */
		valueRange: Range;
		/**
		 * May contain extended information for property: 'valueRange'
		 */
		_valueRange?: Element;
		/**
		 * A value that defines the context specified in this context of use. The interpretation of the value is defined by the code
		 */
		valueReference: Reference;
		/**
		 * May contain extended information for property: 'valueReference'
		 */
		_valueReference?: Element;
	}
	/**
	 * A container for a collection of resources.
	 * From: bundle-spreadsheet.xml
	 */
	export interface Bundle extends Resource {
		/**
		 * An entry in a bundle resource - will either contain a resource or information about a resource (transactions and history only)
		 */
		entry?: BundleEntry[];
		/**
		 * May contain extended information for property: 'entry'
		 */
		_entry?: Element[];
		/**
		 * A persistent identifier for the bundle that won't change as a bundle is copied from server to server. 
		 */
		identifier?: Identifier;
		/**
		 * May contain extended information for property: 'identifier'
		 */
		_identifier?: Element;
		/**
		 * A series of links that provide context to this bundle 
		 */
		link?: BundleLink[];
		/**
		 * May contain extended information for property: 'link'
		 */
		_link?: Element[];
		/**
		 * Digital Signature - base64 encoded. XML-DSig or a JWT
		 */
		signature?: Signature;
		/**
		 * May contain extended information for property: 'signature'
		 */
		_signature?: Element;
		/**
		 * The date/time that the bundle was assembled - i.e. when the resources were placed in the bundle
		 */
		timestamp?: instant;
		/**
		 * May contain extended information for property: 'timestamp'
		 */
		_timestamp?: Element;
		/**
		 * If a set of search matches, this is the total number of entries of type 'match' across all pages in the search.  It does not include search.mode = 'include' or 'outcome' entries and it does not provide a count of the number of entries in the Bundle
		 */
		total?: unsignedInt;
		/**
		 * May contain extended information for property: 'total'
		 */
		_total?: Element;
		/**
		 * Indicates the purpose of this bundle - how it is intended to be used
		 */
		type: code;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
	}
	/**
	 * An entry in a bundle resource - will either contain a resource or information about a resource (transactions and history only)
	 * From: bundle-spreadsheet.xml
	 */
	export interface BundleEntry extends Element {
		/**
		 * The Absolute URL for the resource.  The fullUrl SHALL NOT disagree with the id in the resource - i.e. if the fullUrl is not a urn:uuid, the URL shall be version-independent URL consistent with the Resource.id. The fullUrl is a version independent reference to the resource. The fullUrl element SHALL have a value except that: 
		 * * fullUrl can be empty on a POST (although it does not need to when specifying a temporary id for reference in the bundle)
		 * * Results from operations might involve resources that are not identified.
		 */
		fullUrl?: uri;
		/**
		 * May contain extended information for property: 'fullUrl'
		 */
		_fullUrl?: Element;
		/**
		 * A series of links that provide context to this entry 
		 */
		link?: BundleLink[];
		/**
		 * May contain extended information for property: 'link'
		 */
		_link?: Element[];
		/**
		 * Additional information about how this entry should be processed as part of a transaction or batch.  For history, it shows how the entry was processed to create the version contained in the entry
		 */
		request?: BundleEntryRequest;
		/**
		 * May contain extended information for property: 'request'
		 */
		_request?: Element;
		/**
		 * The Resource for the entry. The purpose/meaning of the resource is determined by the Bundle.type
		 */
		resource?: Resource;
		/**
		 * May contain extended information for property: 'resource'
		 */
		_resource?: Element;
		/**
		 * Indicates the results of processing the corresponding 'request' entry in the batch or transaction being responded to or what the results of an operation where when returning history
		 */
		response?: BundleEntryResponse;
		/**
		 * May contain extended information for property: 'response'
		 */
		_response?: Element;
		/**
		 * Information about the search process that lead to the creation of this entry
		 */
		search?: BundleEntrySearch;
		/**
		 * May contain extended information for property: 'search'
		 */
		_search?: Element;
	}
	/**
	 * Additional information about how this entry should be processed as part of a transaction or batch.  For history, it shows how the entry was processed to create the version contained in the entry
	 * From: bundle-spreadsheet.xml
	 */
	export interface BundleEntryRequest extends Element {
		/**
		 * Only perform the operation if the Etag value matches. For more information, see the API section ["Managing Resource Contention"](http.html#concurrency)
		 */
		ifMatch?: string;
		/**
		 * May contain extended information for property: 'ifMatch'
		 */
		_ifMatch?: Element;
		/**
		 * Only perform the operation if the last updated date matches. See the API documentation for ["Conditional Read"](http.html#cread)
		 */
		ifModifiedSince?: instant;
		/**
		 * May contain extended information for property: 'ifModifiedSince'
		 */
		_ifModifiedSince?: Element;
		/**
		 * Instruct the server not to perform the create if a specified resource already exists. For further information, see the API documentation for ["Conditional Create"](http.html#ccreate). This is just the query portion of the URL - what follows the "?" (not including the "?")
		 */
		ifNoneExist?: string;
		/**
		 * May contain extended information for property: 'ifNoneExist'
		 */
		_ifNoneExist?: Element;
		/**
		 * If the ETag values match, return a 304 Not Modified status. See the API documentation for ["Conditional Read"](http.html#cread)
		 */
		ifNoneMatch?: string;
		/**
		 * May contain extended information for property: 'ifNoneMatch'
		 */
		_ifNoneMatch?: Element;
		/**
		 * In a transaction or batch, this is the HTTP action to be executed for this entry. In a history bundle, this indicates the HTTP action that occurred.
		 */
		method: code;
		/**
		 * May contain extended information for property: 'method'
		 */
		_method?: Element;
		/**
		 * The URL for this entry, relative to the root (the address to which the request is posted)
		 */
		url: uri;
		/**
		 * May contain extended information for property: 'url'
		 */
		_url?: Element;
	}
	/**
	 * Indicates the results of processing the corresponding 'request' entry in the batch or transaction being responded to or what the results of an operation where when returning history
	 * From: bundle-spreadsheet.xml
	 */
	export interface BundleEntryResponse extends Element {
		/**
		 * The Etag for the resource, if the operation for the entry produced a versioned resource (see [Resource Metadata and Versioning](http.html#versioning) and [Managing Resource Contention](http.html#concurrency))
		 */
		etag?: string;
		/**
		 * May contain extended information for property: 'etag'
		 */
		_etag?: Element;
		/**
		 * The date/time that the resource was modified on the server
		 */
		lastModified?: instant;
		/**
		 * May contain extended information for property: 'lastModified'
		 */
		_lastModified?: Element;
		/**
		 * The location header created by processing this operation, populated if the operation returns a location
		 */
		location?: uri;
		/**
		 * May contain extended information for property: 'location'
		 */
		_location?: Element;
		/**
		 * An OperationOutcome containing hints and warnings produced as part of processing this entry in a batch or transaction
		 */
		outcome?: Resource;
		/**
		 * May contain extended information for property: 'outcome'
		 */
		_outcome?: Element;
		/**
		 * The status code returned by processing this entry. The status SHALL start with a 3 digit HTTP code (e.g. 404) and may contain the standard HTTP description associated with the status code
		 */
		status: string;
		/**
		 * May contain extended information for property: 'status'
		 */
		_status?: Element;
	}
	/**
	 * Information about the search process that lead to the creation of this entry
	 * From: bundle-spreadsheet.xml
	 */
	export interface BundleEntrySearch extends Element {
		/**
		 * Why this entry is in the result set - whether it's included as a match or because of an _include requirement, or to convey information or warning information about the search process
		 */
		mode?: code;
		/**
		 * May contain extended information for property: 'mode'
		 */
		_mode?: Element;
		/**
		 * When searching, the server's search ranking score for the entry
		 */
		score?: decimal;
		/**
		 * May contain extended information for property: 'score'
		 */
		_score?: Element;
	}
	/**
	 * A series of links that provide context to this bundle 
	 * From: bundle-spreadsheet.xml
	 */
	export interface BundleLink extends Element {
		/**
		 * A name which details the functional use for this link - see [http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1](http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1)
		 */
		relation: string;
		/**
		 * May contain extended information for property: 'relation'
		 */
		_relation?: Element;
		/**
		 * The reference details for the link
		 */
		url: uri;
		/**
		 * May contain extended information for property: 'url'
		 */
		_url?: Element;
	}
	/**
	 * A resource that includes narrative, extensions, and contained resources.
	 * From: domainresource-spreadsheet.xml
	 */
	export interface DomainResource extends Resource {
		/**
		 * These resources do not have an independent existence apart from the resource that contains them - they cannot be identified independently, and nor can they have their own independent transaction scope
		 */
		contained?: Resource[];
		/**
		 * May contain extended information for property: 'contained'
		 */
		_contained?: Element[];
		/**
		 * May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension
		 */
		extension?: Extension[];
		/**
		 * May contain extended information for property: 'extension'
		 */
		_extension?: Element[];
		/**
		 * May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.
		 * 
		 * Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself)
		 */
		modifierExtension?: Extension[];
		/**
		 * May contain extended information for property: 'modifierExtension'
		 */
		_modifierExtension?: Element[];
		/**
		 * A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it "clinically safe" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety
		 */
		text?: Narrative;
		/**
		 * May contain extended information for property: 'text'
		 */
		_text?: Element;
	}
	/**
	 * An interaction between a patient and healthcare provider(s) for the purpose of providing healthcare service(s) or assessing the health status of a patient.
	 * From: encounter-spreadsheet.xml
	 */
	export interface Encounter extends DomainResource {
		/**
		 * The set of accounts that may be used for billing for this Encounter
		 */
		account?: Reference[];
		/**
		 * May contain extended information for property: 'account'
		 */
		_account?: Element[];
		/**
		 * The appointment that scheduled this encounter
		 */
		appointment?: Reference[];
		/**
		 * May contain extended information for property: 'appointment'
		 */
		_appointment?: Element[];
		/**
		 * The request this encounter satisfies (e.g. incoming referral or procedure request)
		 */
		basedOn?: Reference[];
		/**
		 * May contain extended information for property: 'basedOn'
		 */
		_basedOn?: Element[];
		/**
		 * Concepts representing classification of patient encounter such as ambulatory (outpatient), inpatient, emergency, home health or others due to local variations.
		 */
		class: Coding;
		/**
		 * May contain extended information for property: 'class'
		 */
		_class?: Element;
		/**
		 * The class history permits the tracking of the encounters transitions without needing to go  through the resource history.  This would be used for a case where an admission starts of as an emergency encounter, then transitions into an inpatient scenario. Doing this and not restarting a new encounter ensures that any lab/diagnostic results can more easily follow the patient and not require re-processing and not get lost or cancelled during a kind of discharge from emergency to inpatient.
		 */
		classHistory?: EncounterClassHistory[];
		/**
		 * May contain extended information for property: 'classHistory'
		 */
		_classHistory?: Element[];
		/**
		 * The list of diagnosis relevant to this encounter
		 */
		diagnosis?: EncounterDiagnosis[];
		/**
		 * May contain extended information for property: 'diagnosis'
		 */
		_diagnosis?: Element[];
		/**
		 * Where a specific encounter should be classified as a part of a specific episode(s) of care this field should be used. This association can facilitate grouping of related encounters together for a specific purpose, such as government reporting, issue tracking, association via a common problem.  The association is recorded on the encounter as these are typically created after the episode of care and grouped on entry rather than editing the episode of care to append another encounter to it (the episode of care could span years)
		 */
		episodeOfCare?: Reference[];
		/**
		 * May contain extended information for property: 'episodeOfCare'
		 */
		_episodeOfCare?: Element[];
		/**
		 * Details about the admission to a healthcare service
		 */
		hospitalization?: EncounterHospitalization;
		/**
		 * May contain extended information for property: 'hospitalization'
		 */
		_hospitalization?: Element;
		/**
		 * Identifier(s) by which this encounter is known
		 */
		identifier?: Identifier[];
		/**
		 * May contain extended information for property: 'identifier'
		 */
		_identifier?: Element[];
		/**
		 * Quantity of time the encounter lasted. This excludes the time during leaves of absence.
		 */
		length?: Duration;
		/**
		 * May contain extended information for property: 'length'
		 */
		_length?: Element;
		/**
		 * List of locations where  the patient has been during this encounter
		 */
		location?: EncounterLocation[];
		/**
		 * May contain extended information for property: 'location'
		 */
		_location?: Element[];
		/**
		 * The list of people responsible for providing the service
		 */
		participant?: EncounterParticipant[];
		/**
		 * May contain extended information for property: 'participant'
		 */
		_participant?: Element[];
		/**
		 * Another Encounter of which this encounter is a part of (administratively or in time).
		 */
		partOf?: Reference;
		/**
		 * May contain extended information for property: 'partOf'
		 */
		_partOf?: Element;
		/**
		 * The start and end time of the encounter
		 */
		period?: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * Indicates the urgency of the encounter
		 */
		priority?: CodeableConcept;
		/**
		 * May contain extended information for property: 'priority'
		 */
		_priority?: Element;
		/**
		 * Reason the encounter takes place, expressed as a code. For admissions, this can be used for a coded admission diagnosis
		 */
		reasonCode?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'reasonCode'
		 */
		_reasonCode?: Element[];
		/**
		 * Reason the encounter takes place, expressed as a code. For admissions, this can be used for a coded admission diagnosis
		 */
		reasonReference?: Reference[];
		/**
		 * May contain extended information for property: 'reasonReference'
		 */
		_reasonReference?: Element[];
		/**
		 * The organization that is primarily responsible for this Encounter's services. This MAY be the same as the organization on the Patient record, however it could be different, such as if the actor performing the services was from an external organization (which may be billed seperately) for an external consultation.  Refer to the example bundle showing an abbreviated set of Encounters for a colonoscopy.
		 */
		serviceProvider?: Reference;
		/**
		 * May contain extended information for property: 'serviceProvider'
		 */
		_serviceProvider?: Element;
		/**
		 * Broad categorization of the service that is to be provided (e.g. cardiology)
		 */
		serviceType?: CodeableConcept;
		/**
		 * May contain extended information for property: 'serviceType'
		 */
		_serviceType?: Element;
		/**
		 * planned | in-progress | onhold | completed | cancelled | entered-in-error | unknown
		 */
		status: code;
		/**
		 * May contain extended information for property: 'status'
		 */
		_status?: Element;
		/**
		 * The status history permits the encounter resource to contain the status history without needing to read through the historical versions of the resource, or even have the server store them
		 */
		statusHistory?: EncounterStatusHistory[];
		/**
		 * May contain extended information for property: 'statusHistory'
		 */
		_statusHistory?: Element[];
		/**
		 * The patient or group present at the encounter
		 */
		subject?: Reference;
		/**
		 * May contain extended information for property: 'subject'
		 */
		_subject?: Element;
		/**
		 * The subjectStatus value can be used to track the patient's status within the encounter. It details whether the patient has arrived or departed, has been triaged or is currently in a waiting status.
		 */
		subjectStatus?: CodeableConcept;
		/**
		 * May contain extended information for property: 'subjectStatus'
		 */
		_subjectStatus?: Element;
		/**
		 * Specific type of encounter (e.g. e-mail consultation, surgical day-care, skilled nursing, rehabilitation)
		 */
		type?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element[];
	}
	/**
	 * The class history permits the tracking of the encounters transitions without needing to go  through the resource history.  This would be used for a case where an admission starts of as an emergency encounter, then transitions into an inpatient scenario. Doing this and not restarting a new encounter ensures that any lab/diagnostic results can more easily follow the patient and not require re-processing and not get lost or cancelled during a kind of discharge from emergency to inpatient.
	 * From: encounter-spreadsheet.xml
	 */
	export interface EncounterClassHistory extends Element {
		/**
		 * inpatient | outpatient | ambulatory | emergency +
		 */
		class: Coding;
		/**
		 * May contain extended information for property: 'class'
		 */
		_class?: Element;
		/**
		 * The time that the episode was in the specified class
		 */
		period: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
	}
	/**
	 * The list of diagnosis relevant to this encounter
	 * From: encounter-spreadsheet.xml
	 */
	export interface EncounterDiagnosis extends Element {
		/**
		 * Reason the encounter takes place, as specified using information from another resource. For admissions, this is the admission diagnosis. The indication will typically be a Condition (with other resources referenced in the evidence.detail), or a Procedure
		 */
		condition: Reference;
		/**
		 * May contain extended information for property: 'condition'
		 */
		_condition?: Element;
		/**
		 * Ranking of the diagnosis (for each role type)
		 */
		rank?: positiveInt;
		/**
		 * May contain extended information for property: 'rank'
		 */
		_rank?: Element;
		/**
		 * Role that this diagnosis has within the encounter (e.g. admission, billing, discharge …)
		 */
		use?: CodeableConcept;
		/**
		 * May contain extended information for property: 'use'
		 */
		_use?: Element;
	}
	/**
	 * Details about the admission to a healthcare service
	 * From: encounter-spreadsheet.xml
	 */
	export interface EncounterHospitalization extends Element {
		/**
		 * From where patient was admitted (physician referral, transfer)
		 */
		admitSource?: CodeableConcept;
		/**
		 * May contain extended information for property: 'admitSource'
		 */
		_admitSource?: Element;
		/**
		 * Location/organization to which the patient is discharged
		 */
		destination?: Reference;
		/**
		 * May contain extended information for property: 'destination'
		 */
		_destination?: Element;
		/**
		 * Diet preferences reported by the patient
		 */
		dietPreference?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'dietPreference'
		 */
		_dietPreference?: Element[];
		/**
		 * Category or kind of location after discharge
		 */
		dischargeDisposition?: CodeableConcept;
		/**
		 * May contain extended information for property: 'dischargeDisposition'
		 */
		_dischargeDisposition?: Element;
		/**
		 * The location/organization from which the patient came before admission
		 */
		origin?: Reference;
		/**
		 * May contain extended information for property: 'origin'
		 */
		_origin?: Element;
		/**
		 * Pre-admission identifier
		 */
		preAdmissionIdentifier?: Identifier;
		/**
		 * May contain extended information for property: 'preAdmissionIdentifier'
		 */
		_preAdmissionIdentifier?: Element;
		/**
		 * Whether this hospitalization is a readmission and why if known
		 */
		reAdmission?: CodeableConcept;
		/**
		 * May contain extended information for property: 'reAdmission'
		 */
		_reAdmission?: Element;
		/**
		 * Any special requests that have been made for this hospitalization encounter, such as the provision of specific equipment or other things.
		 */
		specialArrangement?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'specialArrangement'
		 */
		_specialArrangement?: Element[];
		/**
		 * Special courtesies (VIP, board member)
		 */
		specialCourtesy?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'specialCourtesy'
		 */
		_specialCourtesy?: Element[];
	}
	/**
	 * List of locations where  the patient has been during this encounter
	 * From: encounter-spreadsheet.xml
	 */
	export interface EncounterLocation extends Element {
		/**
		 * The location where the encounter takes place
		 */
		location: Reference;
		/**
		 * May contain extended information for property: 'location'
		 */
		_location?: Element;
		/**
		 * Time period during which the patient was present at the location
		 */
		period?: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * This will be used to specify the required levels (bed/ward/room/etc.) desired to be recorded to simplify either messaging or query.
		 */
		physicalType?: CodeableConcept;
		/**
		 * May contain extended information for property: 'physicalType'
		 */
		_physicalType?: Element;
		/**
		 * The status of the participants' presence at the specified location during the period specified. If the participant is no longer at the location, then the period will have an end date/time
		 */
		status?: code;
		/**
		 * May contain extended information for property: 'status'
		 */
		_status?: Element;
	}
	/**
	 * The list of people responsible for providing the service
	 * From: encounter-spreadsheet.xml
	 */
	export interface EncounterParticipant extends Element {
		/**
		 * Persons involved in the encounter other than the patient
		 */
		individual?: Reference;
		/**
		 * May contain extended information for property: 'individual'
		 */
		_individual?: Element;
		/**
		 * The period of time that the specified participant participated in the encounter. These can overlap or be sub-sets of the overall encounter's period
		 */
		period?: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * Role of participant in encounter
		 */
		type?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element[];
	}
	/**
	 * The status history permits the encounter resource to contain the status history without needing to read through the historical versions of the resource, or even have the server store them
	 * From: encounter-spreadsheet.xml
	 */
	export interface EncounterStatusHistory extends Element {
		/**
		 * The time that the episode was in the specified status
		 */
		period: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * planned | in-progress | onhold | completed | cancelled | entered-in-error | unknown
		 */
		status: code;
		/**
		 * May contain extended information for property: 'status'
		 */
		_status?: Element;
	}
	/**
	 * Measurements and simple assertions made about a patient, device or other subject.
	 * From: observation-spreadsheet.xml
	 */
	export interface Observation extends DomainResource {
		/**
		 * A plan, proposal or order that is fulfilled in whole or in part by this event.  For example, a MedicationRequest may require a patient to have laboratory test performed before  it is dispensed.
		 */
		basedOn?: Reference[];
		/**
		 * May contain extended information for property: 'basedOn'
		 */
		_basedOn?: Element[];
		/**
		 * Indicates the site on the subject's body where the observation was made (i.e. the target site).
		 */
		bodySite?: CodeableConcept;
		/**
		 * May contain extended information for property: 'bodySite'
		 */
		_bodySite?: Element;
		/**
		 *  A code that classifies the general type of observation being made.
		 */
		category?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'category'
		 */
		_category?: Element[];
		/**
		 * Describes what was observed. Sometimes this is called the observation "name"
		 */
		code: CodeableConcept;
		/**
		 * May contain extended information for property: 'code'
		 */
		_code?: Element;
		/**
		 * Some observations have multiple component observations.  These component observations are expressed as separate code value pairs that share the same attributes.  Examples include systolic and diastolic component observations for blood pressure measurement and multiple component observations for genetics observations.  
		 */
		component?: ObservationComponent[];
		/**
		 * May contain extended information for property: 'component'
		 */
		_component?: Element[];
		/**
		 * Provides a reason why the expected value in the element Observation.value[x] is missing.
		 */
		dataAbsentReason?: CodeableConcept;
		/**
		 * May contain extended information for property: 'dataAbsentReason'
		 */
		_dataAbsentReason?: Element;
		/**
		 *  The target resource that represents a measurement from which this observation value is derived. For example, a calculated anion gap or a fetal measurement based on an ultrasound image.
		 */
		derivedFrom?: Reference[];
		/**
		 * May contain extended information for property: 'derivedFrom'
		 */
		_derivedFrom?: Element[];
		/**
		 * The device used to generate the observation data.
		 */
		device?: Reference;
		/**
		 * May contain extended information for property: 'device'
		 */
		_device?: Element;
		/**
		 * The time or time-period the observed value is asserted as being true. For biological subjects - e.g. human patients - this is usually called the "physiologically relevant time". This is usually either the time of the procedure or of specimen collection, but very often the source of the date/time is not known, only the date/time itself
		 */
		effectiveDateTime?: dateTime;
		/**
		 * May contain extended information for property: 'effectiveDateTime'
		 */
		_effectiveDateTime?: Element;
		/**
		 * The time or time-period the observed value is asserted as being true. For biological subjects - e.g. human patients - this is usually called the "physiologically relevant time". This is usually either the time of the procedure or of specimen collection, but very often the source of the date/time is not known, only the date/time itself
		 */
		effectiveInstant?: instant;
		/**
		 * May contain extended information for property: 'effectiveInstant'
		 */
		_effectiveInstant?: Element;
		/**
		 * The time or time-period the observed value is asserted as being true. For biological subjects - e.g. human patients - this is usually called the "physiologically relevant time". This is usually either the time of the procedure or of specimen collection, but very often the source of the date/time is not known, only the date/time itself
		 */
		effectivePeriod?: Period;
		/**
		 * May contain extended information for property: 'effectivePeriod'
		 */
		_effectivePeriod?: Element;
		/**
		 * The time or time-period the observed value is asserted as being true. For biological subjects - e.g. human patients - this is usually called the "physiologically relevant time". This is usually either the time of the procedure or of specimen collection, but very often the source of the date/time is not known, only the date/time itself
		 */
		effectiveTiming?: Timing;
		/**
		 * May contain extended information for property: 'effectiveTiming'
		 */
		_effectiveTiming?: Element;
		/**
		 * The healthcare event  (e.g. a patient and healthcare provider interaction) during which this observation is made
		 */
		encounter?: Reference;
		/**
		 * May contain extended information for property: 'encounter'
		 */
		_encounter?: Element;
		/**
		 * The actual focus of an observation when it is not the patient of record representing something or someone associated with the patient such as a spouse, parent, fetus, or donor. For example, fetus observations in a mother's record.  The focus of an observation could also be an existing condition,  an intervention, the subject's diet,  another observation of the subject,  or a body structure such as tumor or implanted device.   An example use case would be using the Observation resource to capture whether the mother is trained to change her child's tracheostomy tube. In this example, the child is the patient of record and the mother is the focus.
		 */
		focus?: Reference[];
		/**
		 * May contain extended information for property: 'focus'
		 */
		_focus?: Element[];
		/**
		 * This observation is a group observation (e.g. a battery, a panel of tests, a set of vital sign measurements) that includes the target as a member of the group.
		 */
		hasMember?: Reference[];
		/**
		 * May contain extended information for property: 'hasMember'
		 */
		_hasMember?: Element[];
		/**
		 * A unique identifier assigned to this observation.
		 */
		identifier?: Identifier[];
		/**
		 * May contain extended information for property: 'identifier'
		 */
		_identifier?: Element[];
		/**
		 *  A categorical assessment of an observation value.  For example, high, low, normal.
		 */
		interpretation?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'interpretation'
		 */
		_interpretation?: Element[];
		/**
		 * The date and time this version of the observation was made available to providers, typically after the results have been reviewed and verified.
		 */
		issued?: instant;
		/**
		 * May contain extended information for property: 'issued'
		 */
		_issued?: Element;
		/**
		 * Indicates the mechanism used to perform the observation
		 */
		method?: CodeableConcept;
		/**
		 * May contain extended information for property: 'method'
		 */
		_method?: Element;
		/**
		 * Comments about the observation or the results.
		 */
		note?: Annotation[];
		/**
		 * May contain extended information for property: 'note'
		 */
		_note?: Element[];
		/**
		 * A larger event of which this particular Observation is a component or step.  For example,  an observation as part of a procedure.
		 */
		partOf?: Reference[];
		/**
		 * May contain extended information for property: 'partOf'
		 */
		_partOf?: Element[];
		/**
		 * Who was responsible for asserting the observed value as "true"
		 */
		performer?: Reference[];
		/**
		 * May contain extended information for property: 'performer'
		 */
		_performer?: Element[];
		/**
		 * Guidance on how to interpret the value by comparison to a normal or recommended range.  Multiple reference ranges are interpreted as an "OR".   In other words, to represent two distinct target populations, two `referenceRange` elements would be used.
		 */
		referenceRange?: ObservationReferenceRange[];
		/**
		 * May contain extended information for property: 'referenceRange'
		 */
		_referenceRange?: Element[];
		/**
		 * The specimen that was used when this observation was made 
		 */
		specimen?: Reference;
		/**
		 * May contain extended information for property: 'specimen'
		 */
		_specimen?: Element;
		/**
		 * The status of the result value
		 */
		status: code;
		/**
		 * May contain extended information for property: 'status'
		 */
		_status?: Element;
		/**
		 * The patient, or group of patients, location, or device this observation is about and into whose record the observation is placed. If the actual focus of the observation is different from the subject (or a sample of, part, or region of the subject), the `focus` element or the `code` itself specifies the actual focus of the observation.
		 */
		subject?: Reference;
		/**
		 * May contain extended information for property: 'subject'
		 */
		_subject?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueBoolean?: boolean;
		/**
		 * May contain extended information for property: 'valueBoolean'
		 */
		_valueBoolean?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueCodeableConcept?: CodeableConcept;
		/**
		 * May contain extended information for property: 'valueCodeableConcept'
		 */
		_valueCodeableConcept?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueDateTime?: dateTime;
		/**
		 * May contain extended information for property: 'valueDateTime'
		 */
		_valueDateTime?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueInteger?: integer;
		/**
		 * May contain extended information for property: 'valueInteger'
		 */
		_valueInteger?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valuePeriod?: Period;
		/**
		 * May contain extended information for property: 'valuePeriod'
		 */
		_valuePeriod?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueQuantity?: Quantity;
		/**
		 * May contain extended information for property: 'valueQuantity'
		 */
		_valueQuantity?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueRange?: Range;
		/**
		 * May contain extended information for property: 'valueRange'
		 */
		_valueRange?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueRatio?: Ratio;
		/**
		 * May contain extended information for property: 'valueRatio'
		 */
		_valueRatio?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueSampledData?: SampledData;
		/**
		 * May contain extended information for property: 'valueSampledData'
		 */
		_valueSampledData?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueString?: string;
		/**
		 * May contain extended information for property: 'valueString'
		 */
		_valueString?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueTime?: time;
		/**
		 * May contain extended information for property: 'valueTime'
		 */
		_valueTime?: Element;
	}
	/**
	 * Some observations have multiple component observations.  These component observations are expressed as separate code value pairs that share the same attributes.  Examples include systolic and diastolic component observations for blood pressure measurement and multiple component observations for genetics observations.  
	 * From: observation-spreadsheet.xml
	 */
	export interface ObservationComponent extends Element {
		/**
		 * Describes what was observed. Sometimes this is called the observation "code"
		 */
		code: CodeableConcept;
		/**
		 * May contain extended information for property: 'code'
		 */
		_code?: Element;
		/**
		 * Provides a reason why the expected value in the element Observation.component.value[x] is missing.
		 */
		dataAbsentReason?: CodeableConcept;
		/**
		 * May contain extended information for property: 'dataAbsentReason'
		 */
		_dataAbsentReason?: Element;
		/**
		 *  A categorical assessment of an observation value.  For example, high, low, normal.
		 */
		interpretation?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'interpretation'
		 */
		_interpretation?: Element[];
		/**
		 * Guidance on how to interpret the value by comparison to a normal or recommended range
		 */
		referenceRange?: ObservationReferenceRange[];
		/**
		 * May contain extended information for property: 'referenceRange'
		 */
		_referenceRange?: Element[];
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueBoolean?: boolean;
		/**
		 * May contain extended information for property: 'valueBoolean'
		 */
		_valueBoolean?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueCodeableConcept?: CodeableConcept;
		/**
		 * May contain extended information for property: 'valueCodeableConcept'
		 */
		_valueCodeableConcept?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueDateTime?: dateTime;
		/**
		 * May contain extended information for property: 'valueDateTime'
		 */
		_valueDateTime?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueInteger?: integer;
		/**
		 * May contain extended information for property: 'valueInteger'
		 */
		_valueInteger?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valuePeriod?: Period;
		/**
		 * May contain extended information for property: 'valuePeriod'
		 */
		_valuePeriod?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueQuantity?: Quantity;
		/**
		 * May contain extended information for property: 'valueQuantity'
		 */
		_valueQuantity?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueRange?: Range;
		/**
		 * May contain extended information for property: 'valueRange'
		 */
		_valueRange?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueRatio?: Ratio;
		/**
		 * May contain extended information for property: 'valueRatio'
		 */
		_valueRatio?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueSampledData?: SampledData;
		/**
		 * May contain extended information for property: 'valueSampledData'
		 */
		_valueSampledData?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueString?: string;
		/**
		 * May contain extended information for property: 'valueString'
		 */
		_valueString?: Element;
		/**
		 * The information determined as a result of making the observation, if the information has a simple value
		 */
		valueTime?: time;
		/**
		 * May contain extended information for property: 'valueTime'
		 */
		_valueTime?: Element;
	}
	/**
	 * Guidance on how to interpret the value by comparison to a normal or recommended range.  Multiple reference ranges are interpreted as an "OR".   In other words, to represent two distinct target populations, two `referenceRange` elements would be used.
	 * From: observation-spreadsheet.xml
	 */
	export interface ObservationReferenceRange extends Element {
		/**
		 * The age at which this reference range is applicable. This is a neonatal age (e.g. number of weeks at term) if the meaning says so
		 */
		age?: Range;
		/**
		 * May contain extended information for property: 'age'
		 */
		_age?: Element;
		/**
		 * Codes to indicate the target population this reference range applies to.  For example, a reference range may be based on the normal population or a particular sex or race.  Multiple `appliesTo`  are interpreted as an "AND" of the target populations.  For example, to represent a target population of African American females, both a code of female and a code for African American would be used.
		 */
		appliesTo?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'appliesTo'
		 */
		_appliesTo?: Element[];
		/**
		 * The value of the high bound of the reference range.  The high bound of the reference range endpoint is inclusive of the value (e.g.  reference range is >=5 - <=9). If the high bound is omitted,  it is assumed to be meaningless (e.g. reference range is >= 2.3).
		 */
		high?: SimpleQuantity;
		/**
		 * May contain extended information for property: 'high'
		 */
		_high?: Element;
		/**
		 * The value of the low bound of the reference range.  The low bound of the reference range endpoint is inclusive of the value (e.g.  reference range is >=5 - <=9). If the low bound is omitted,  it is assumed to be meaningless (e.g. reference range is <=2.3).
		 */
		low?: SimpleQuantity;
		/**
		 * May contain extended information for property: 'low'
		 */
		_low?: Element;
		/**
		 * Text based reference range in an observation which may be used when a quantitative range is not appropriate for an observation.  An example would be a reference value of "Negative" or a list or table of "normals".
		 */
		text?: string;
		/**
		 * May contain extended information for property: 'text'
		 */
		_text?: Element;
		/**
		 * Codes to indicate the what part of the targeted reference population it applies to. For example, the normal or therapeutic range.
		 */
		type?: CodeableConcept;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
	}
	/**
	 * Demographics and other administrative information about an individual or animal receiving care or other health-related services.
	 * From: patient-spreadsheet.xml
	 */
	export interface Patient extends DomainResource {
		/**
		 * Whether this patient record is in active use. 
		 * Many systems use this property to mark as non-current patients, such as those that have not been seen for a period of time based on an organization's business rules.
		 * 
		 * It is often used to filter patient lists to exclude inactive patients
		 * 
		 * Deceased patients may also be marked as inactive for the same reasons, but may be active for some time after death.
		 */
		active?: boolean;
		/**
		 * May contain extended information for property: 'active'
		 */
		_active?: Element;
		/**
		 * An address for the individual
		 */
		address?: Address[];
		/**
		 * May contain extended information for property: 'address'
		 */
		_address?: Element[];
		/**
		 * The date of birth for the individual
		 */
		birthDate?: date;
		/**
		 * May contain extended information for property: 'birthDate'
		 */
		_birthDate?: Element;
		/**
		 * A language which may be used to communicate with the patient about his or her health
		 */
		communication?: PatientCommunication[];
		/**
		 * May contain extended information for property: 'communication'
		 */
		_communication?: Element[];
		/**
		 * A contact party (e.g. guardian, partner, friend) for the patient
		 */
		contact?: PatientContact[];
		/**
		 * May contain extended information for property: 'contact'
		 */
		_contact?: Element[];
		/**
		 * Indicates if the individual is deceased or not
		 */
		deceasedBoolean?: boolean;
		/**
		 * May contain extended information for property: 'deceasedBoolean'
		 */
		_deceasedBoolean?: Element;
		/**
		 * Indicates if the individual is deceased or not
		 */
		deceasedDateTime?: dateTime;
		/**
		 * May contain extended information for property: 'deceasedDateTime'
		 */
		_deceasedDateTime?: Element;
		/**
		 * Administrative Gender - the gender that the patient is considered to have for administration and record keeping purposes. 
		 */
		gender?: code;
		/**
		 * May contain extended information for property: 'gender'
		 */
		_gender?: Element;
		/**
		 * Patient's nominated care provider
		 */
		generalPractitioner?: Reference[];
		/**
		 * May contain extended information for property: 'generalPractitioner'
		 */
		_generalPractitioner?: Element[];
		/**
		 * An identifier for this patient
		 */
		identifier?: Identifier[];
		/**
		 * May contain extended information for property: 'identifier'
		 */
		_identifier?: Element[];
		/**
		 * Link to another patient resource that concerns the same actual patient
		 */
		link?: PatientLink[];
		/**
		 * May contain extended information for property: 'link'
		 */
		_link?: Element[];
		/**
		 * Organization that is the custodian of the patient record
		 */
		managingOrganization?: Reference;
		/**
		 * May contain extended information for property: 'managingOrganization'
		 */
		_managingOrganization?: Element;
		/**
		 * This field contains a patient's most recent marital (civil) status.
		 */
		maritalStatus?: CodeableConcept;
		/**
		 * May contain extended information for property: 'maritalStatus'
		 */
		_maritalStatus?: Element;
		/**
		 * Indicates whether the patient is part of a multiple (boolean) or indicates the actual birth order (integer).
		 */
		multipleBirthBoolean?: boolean;
		/**
		 * May contain extended information for property: 'multipleBirthBoolean'
		 */
		_multipleBirthBoolean?: Element;
		/**
		 * Indicates whether the patient is part of a multiple (boolean) or indicates the actual birth order (integer).
		 */
		multipleBirthInteger?: integer;
		/**
		 * May contain extended information for property: 'multipleBirthInteger'
		 */
		_multipleBirthInteger?: Element;
		/**
		 * A name associated with the individual. 
		 */
		name?: HumanName[];
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element[];
		/**
		 * Image of the patient
		 */
		photo?: Attachment[];
		/**
		 * May contain extended information for property: 'photo'
		 */
		_photo?: Element[];
		/**
		 * A contact detail (e.g. a telephone number or an email address) by which the individual may be contacted. 
		 */
		telecom?: ContactPoint[];
		/**
		 * May contain extended information for property: 'telecom'
		 */
		_telecom?: Element[];
	}
	/**
	 * A language which may be used to communicate with the patient about his or her health
	 * From: patient-spreadsheet.xml
	 */
	export interface PatientCommunication extends Element {
		/**
		 * The ISO-639-1 alpha 2 code in lower case for the language, optionally followed by a hyphen and the ISO-3166-1 alpha 2 code for the region in upper case; e.g. "en" for English, or "en-US" for American English versus "en-EN" for England English
		 */
		language: CodeableConcept;
		/**
		 * May contain extended information for property: 'language'
		 */
		_language?: Element;
		/**
		 * Indicates whether or not the patient prefers this language (over other languages he masters up a certain level)
		 */
		preferred?: boolean;
		/**
		 * May contain extended information for property: 'preferred'
		 */
		_preferred?: Element;
	}
	/**
	 * A contact party (e.g. guardian, partner, friend) for the patient
	 * From: patient-spreadsheet.xml
	 */
	export interface PatientContact extends Element {
		/**
		 * Address for the contact person
		 */
		address?: Address;
		/**
		 * May contain extended information for property: 'address'
		 */
		_address?: Element;
		/**
		 * Administrative Gender - the gender that the contact person is considered to have for administration and record keeping purposes. 
		 */
		gender?: code;
		/**
		 * May contain extended information for property: 'gender'
		 */
		_gender?: Element;
		/**
		 * A name associated with the contact person
		 */
		name?: HumanName;
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element;
		/**
		 * Organization on behalf of which the contact is acting or for which the contact is working.
		 */
		organization?: Reference;
		/**
		 * May contain extended information for property: 'organization'
		 */
		_organization?: Element;
		/**
		 * The period during which this contact person or organization is valid to be contacted relating to this patient
		 */
		period?: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
		/**
		 * The nature of the relationship between the patient and the contact person
		 */
		relationship?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'relationship'
		 */
		_relationship?: Element[];
		/**
		 * A contact detail for the person, e.g. a telephone number or an email address.
		 */
		telecom?: ContactPoint[];
		/**
		 * May contain extended information for property: 'telecom'
		 */
		_telecom?: Element[];
	}
	/**
	 * Link to another patient resource that concerns the same actual patient
	 * From: patient-spreadsheet.xml
	 */
	export interface PatientLink extends Element {
		/**
		 * The other patient resource that the link refers to
		 */
		other: Reference;
		/**
		 * May contain extended information for property: 'other'
		 */
		_other?: Element;
		/**
		 * The type of link between this patient resource and another patient resource.
		 */
		type: code;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
	}
	/**
	 * A person who is directly or indirectly involved in the provisioning of healthcare.
	 * From: practitioner-spreadsheet.xml
	 */
	export interface Practitioner extends DomainResource {
		/**
		 * Whether this practitioner's record is in active use
		 */
		active?: boolean;
		/**
		 * May contain extended information for property: 'active'
		 */
		_active?: Element;
		/**
		 * Address(es) of the practitioner that are not role specific (typically home address). 
	Work addresses are not typically entered in this property as they are usually role dependent.
		 */
		address?: Address[];
		/**
		 * May contain extended information for property: 'address'
		 */
		_address?: Element[];
		/**
		 * The date of birth for the practitioner
		 */
		birthDate?: date;
		/**
		 * May contain extended information for property: 'birthDate'
		 */
		_birthDate?: Element;
		/**
		 * A language the practitioner can use in patient communication
		 */
		communication?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'communication'
		 */
		_communication?: Element[];
		/**
		 * Administrative Gender - the gender that the person is considered to have for administration and record keeping purposes. 
		 */
		gender?: code;
		/**
		 * May contain extended information for property: 'gender'
		 */
		_gender?: Element;
		/**
		 * An identifier that applies to this person in this role
		 */
		identifier?: Identifier[];
		/**
		 * May contain extended information for property: 'identifier'
		 */
		_identifier?: Element[];
		/**
		 * The name(s) associated with the practitioner
		 */
		name?: HumanName[];
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element[];
		/**
		 * The organization that the practitioner represents
		 */
		organization?: Reference;
		/**
		 * May contain extended information for property: 'organization'
		 */
		_organization?: Element;
		/**
		 * Image of the person
		 */
		photo?: Attachment[];
		/**
		 * May contain extended information for property: 'photo'
		 */
		_photo?: Element[];
		/**
		 * The official certifications, training, and licenses that authorize or otherwise pertain to the provision of care by the practitioner.  For example, a medical license issued by a medical board authorizing the practitioner to practice medicine within a certian locality.
		 */
		qualification?: PractitionerQualification[];
		/**
		 * May contain extended information for property: 'qualification'
		 */
		_qualification?: Element[];
		/**
		 * A contact detail for the practitioner, e.g. a telephone number or an email address.
		 */
		telecom?: ContactPoint[];
		/**
		 * May contain extended information for property: 'telecom'
		 */
		_telecom?: Element[];
	}
	/**
	 * The official certifications, training, and licenses that authorize or otherwise pertain to the provision of care by the practitioner.  For example, a medical license issued by a medical board authorizing the practitioner to practice medicine within a certian locality.
	 * From: practitioner-spreadsheet.xml
	 */
	export interface PractitionerQualification extends Element {
		/**
		 * Coded representation of the qualification
		 */
		code: CodeableConcept;
		/**
		 * May contain extended information for property: 'code'
		 */
		_code?: Element;
		/**
		 * An identifier that applies to this person's qualification in this role
		 */
		identifier?: Identifier[];
		/**
		 * May contain extended information for property: 'identifier'
		 */
		_identifier?: Element[];
		/**
		 * Organization that regulates and issues the qualification
		 */
		issuer?: Reference;
		/**
		 * May contain extended information for property: 'issuer'
		 */
		_issuer?: Element;
		/**
		 * Period during which the qualification is valid
		 */
		period?: Period;
		/**
		 * May contain extended information for property: 'period'
		 */
		_period?: Element;
	}
	/**
	 * This is the base resource type for everything.
	 * From: resource-spreadsheet.xml
	 */
	export interface Resource {
		/**
		 * The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes
		 */
		id?: id;
		/**
		 * May contain extended information for property: 'id'
		 */
		_id?: Element;
		/**
		 * A reference to a set of rules that were followed when the resource was constructed, and which must be understood when processing the content. Often, this is a reference to an implementation guide that defines the special rules along with other profiles etc.
		 */
		implicitRules?: uri;
		/**
		 * May contain extended information for property: 'implicitRules'
		 */
		_implicitRules?: Element;
		/**
		 * The base language in which the resource is written
		 */
		language?: code;
		/**
		 * May contain extended information for property: 'language'
		 */
		_language?: Element;
		/**
		 * The metadata about the resource. This is content that is maintained by the infrastructure. Changes to the content might not always be associated with version changes to the resource
		 */
		meta?: Meta;
		/**
		 * May contain extended information for property: 'meta'
		 */
		_meta?: Element;
	}
	/**
	 * WARN: SimpleQuantity definition cannot be found!
	 * From: definition-file-not-found.xml
	 */
	export type SimpleQuantity = Quantity;
	/**
	 * WARN: Structure definition cannot be found!
	 * From: definition-file-not-found.xml
	 */
	export type Structure = Element;
	/**
	 * The subscription resource describes a particular client's request to be notified about a Topic
	 * From: subscription-spreadsheet.xml
	 */
	export interface Subscription extends DomainResource {
		/**
		 * Details where to send notifications when resources are received that meet the criteria
		 */
		channel: SubscriptionChannel;
		/**
		 * May contain extended information for property: 'channel'
		 */
		_channel?: Element;
		/**
		 * Contact details for a human to contact about the subscription. The primary use of this for system administrator troubleshooting
		 */
		contact?: ContactPoint[];
		/**
		 * May contain extended information for property: 'contact'
		 */
		_contact?: Element[];
		/**
		 * The time for the server to turn the subscription off
		 */
		end?: instant;
		/**
		 * May contain extended information for property: 'end'
		 */
		_end?: Element;
		/**
		 * A record of the last error that occurred when the server processed a notification
		 */
		error?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'error'
		 */
		_error?: Element[];
		/**
		 * A record of  the number of events for which the server has attempted delivery on this subscription (i.e., the number of events that occurred while the subscription is in an "active" or "error" state -- not "requested" or "off").   Server Initializes to 0 for a new subscription.  Repeated attempts at delivery of the *same* event notification do not increment this counter.
		 */
		eventCount?: positiveInt;
		/**
		 * May contain extended information for property: 'eventCount'
		 */
		_eventCount?: Element;
		/**
		 * The filter properties to be applied to narrow the topic stream.  When multiple filters are applied, evaluates to true if all the conditions are met; otherwise it returns false.   (i.e., logical AND)
		 */
		filterBy?: SubscriptionFilterBy[];
		/**
		 * May contain extended information for property: 'filterBy'
		 */
		_filterBy?: Element[];
		/**
		 * A formal identifier that is used to identify this code system when it is represented in other formats, or referenced in a specification, model, design or an instance.
		 */
		identifier?: Identifier[];
		/**
		 * May contain extended information for property: 'identifier'
		 */
		_identifier?: Element[];
		/**
		 * A natural language name identifying the subscription.
		 */
		name?: string;
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element;
		/**
		 * A description of why this subscription is defined
		 */
		reason: string;
		/**
		 * May contain extended information for property: 'reason'
		 */
		_reason?: Element;
		/**
		 * The status of the subscription, which marks the server state for managing the subscription
		 */
		status: code;
		/**
		 * May contain extended information for property: 'status'
		 */
		_status?: Element;
		/**
		 * The reference to the topic to be notified about.
		 */
		topic: Reference;
		/**
		 * May contain extended information for property: 'topic'
		 */
		_topic?: Element;
	}
	/**
	 * Details where to send notifications when resources are received that meet the criteria
	 * From: subscription-spreadsheet.xml
	 */
	export interface SubscriptionChannel extends Element {
		/**
		 * The url that describes the actual end-point to send messages to
		 */
		endpoint?: url;
		/**
		 * May contain extended information for property: 'endpoint'
		 */
		_endpoint?: Element;
		/**
		 * Additional headers / information to send as part of the notification
		 */
		header?: string[];
		/**
		 * May contain extended information for property: 'header'
		 */
		_header?: Element[];
		/**
		 * If present,  a 'hearbeat" notification (keepalive) is sent via this channel with an the interval period equal to this elements integer value in seconds.    If not present, a heartbeat notification is not sent.
		 */
		heartbeatPeriod?: positiveInt;
		/**
		 * May contain extended information for property: 'heartbeatPeriod'
		 */
		_heartbeatPeriod?: Element;
		/**
		 * The payload mimetype and content.  If the payload is not present, then there is no payload in the notification, just a notification. 
		 */
		payload?: SubscriptionChannelPayload;
		/**
		 * May contain extended information for property: 'payload'
		 */
		_payload?: Element;
		/**
		 * The type of channel to send notifications on
		 */
		type: CodeableConcept;
		/**
		 * May contain extended information for property: 'type'
		 */
		_type?: Element;
	}
	/**
	 * The payload mimetype and content.  If the payload is not present, then there is no payload in the notification, just a notification. 
	 * From: subscription-spreadsheet.xml
	 */
	export interface SubscriptionChannelPayload extends Element {
		/**
		 * How much of the resource content to deliver in the notification payload. The choices are an empty payload, only the resource id, or the full resource content.
		 */
		content?: code;
		/**
		 * May contain extended information for property: 'content'
		 */
		_content?: Element;
		/**
		 * The mime type to send the payload in - either application/fhir+xml, or application/fhir+json. The mime type "text/plain" may also be used for Email and SMS subscriptions
		 */
		contentType?: code;
		/**
		 * May contain extended information for property: 'contentType'
		 */
		_contentType?: Element;
	}
	/**
	 * The filter properties to be applied to narrow the topic stream.  When multiple filters are applied, evaluates to true if all the conditions are met; otherwise it returns false.   (i.e., logical AND)
	 * From: subscription-spreadsheet.xml
	 */
	export interface SubscriptionFilterBy extends Element {
		/**
		 * The operator to apply to the filter value. 
		 */
		matchType?: code;
		/**
		 * May contain extended information for property: 'matchType'
		 */
		_matchType?: Element;
		/**
		 * The filter label (=key) as defined in the `Topic.canFilterBy.name`  element
		 */
		name: string;
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element;
		/**
		 * The literal value or resource path as is legal in search - for example, "Patient/123" or "le1950".
		 */
		value: string;
		/**
		 * May contain extended information for property: 'value'
		 */
		_value?: Element;
	}
	/**
	 * Describes a stream of resource state changes identified by trigger criteria and annotated with labels useful to filter projections from this topic
	 * From: topic-spreadsheet.xml
	 */
	export interface Topic extends DomainResource {
		/**
		 * The date on which the asset content was approved by the publisher. Approval happens once when the content is officially approved for usage
		 */
		approvalDate?: date;
		/**
		 * May contain extended information for property: 'approvalDate'
		 */
		_approvalDate?: Element;
		/**
		 * List of properties by which messages on the topic can be filtered
		 */
		canFilterBy?: TopicCanFilterBy[];
		/**
		 * May contain extended information for property: 'canFilterBy'
		 */
		_canFilterBy?: Element[];
		/**
		 * Contact details to assist a user in finding and communicating with the publisher
		 */
		contact?: ContactDetail[];
		/**
		 * May contain extended information for property: 'contact'
		 */
		_contact?: Element[];
		/**
		 * A copyright statement relating to the Topic and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the Topic
		 */
		copyright?: markdown;
		/**
		 * May contain extended information for property: 'copyright'
		 */
		_copyright?: Element;
		/**
		 * For draft definitions, indicates the date of initial creation.  For active definitions, represents the date of activation.  For withdrawn definitions, indicates the date of withdrawal.
		 */
		date?: dateTime;
		/**
		 * May contain extended information for property: 'date'
		 */
		_date?: Element;
		/**
		 * The canonical URL pointing to another FHIR-defined Topic that is adhered to in whole or in part by this Topic
		 */
		derivedFromCanonical?: canonical[];
		/**
		 * May contain extended information for property: 'derivedFromCanonical'
		 */
		_derivedFromCanonical?: Element[];
		/**
		 * The URL pointing to an externally-defined subscription topic or other definition that is adhered to in whole or in part by this definition.
		 */
		derivedFromUri?: uri[];
		/**
		 * May contain extended information for property: 'derivedFromUri'
		 */
		_derivedFromUri?: Element[];
		/**
		 * A free text natural language description of the Topic from the consumer's perspective
		 */
		description?: markdown;
		/**
		 * May contain extended information for property: 'description'
		 */
		_description?: Element;
		/**
		 * The period during which the Topic content was or is planned to be effective
		 */
		effectivePeriod?: Period;
		/**
		 * May contain extended information for property: 'effectivePeriod'
		 */
		_effectivePeriod?: Element;
		/**
		 * A flag to indicate that this Topic is authored for testing purposes (or education/evaluation/marketing), and is not intended to be used for genuine usage
		 */
		experimental?: boolean;
		/**
		 * May contain extended information for property: 'experimental'
		 */
		_experimental?: Element;
		/**
		 * Business identifiers assigned to this Topic by the performer and/or other systems.  These identifiers remain constant as the resource is updated and propagates from server to server
		 */
		identifier?: Identifier[];
		/**
		 * May contain extended information for property: 'identifier'
		 */
		_identifier?: Element[];
		/**
		 * A jurisdiction in which the Topic is intended to be used
		 */
		jurisdiction?: CodeableConcept[];
		/**
		 * May contain extended information for property: 'jurisdiction'
		 */
		_jurisdiction?: Element[];
		/**
		 * The date on which the asset content was last reviewed. Review happens periodically after that, but doesn't change the original approval date.
		 */
		lastReviewDate?: date;
		/**
		 * May contain extended information for property: 'lastReviewDate'
		 */
		_lastReviewDate?: Element;
		/**
		 * Helps establish the "authority/credibility" of the Topic.  May also allow for contact
		 */
		publisher?: Reference;
		/**
		 * May contain extended information for property: 'publisher'
		 */
		_publisher?: Element;
		/**
		 * Explains why this Topic is needed and why it has been designed as it has
		 */
		purpose?: markdown;
		/**
		 * May contain extended information for property: 'purpose'
		 */
		_purpose?: Element;
		/**
		 * Completed or terminated request(s) whose function is taken by this new request
		 */
		replaces?: canonical[];
		/**
		 * May contain extended information for property: 'replaces'
		 */
		_replaces?: Element[];
		/**
		 * The criteria for including updates to a nominated resource in the topic.  Thie criteria may be just a human readable description and/or a full FHIR search string or FHIRPath expression.
		 */
		resourceTrigger?: TopicResourceTrigger;
		/**
		 * May contain extended information for property: 'resourceTrigger'
		 */
		_resourceTrigger?: Element;
		/**
		 * The current state of the Topic
		 */
		status: code;
		/**
		 * May contain extended information for property: 'status'
		 */
		_status?: Element;
		/**
		 * A short, descriptive, user-friendly title for the Topic, for example, "admission".
		 */
		title?: string;
		/**
		 * May contain extended information for property: 'title'
		 */
		_title?: Element;
		/**
		 * An absolute URL that is used to identify this Topic when it is referenced in a specification, model, design or an instance. This SHALL be a URL, SHOULD be globally unique, and SHOULD be an address at which this Topic is (or will be) published. The URL SHOULD include the major version of the Topic. For more information see [Technical and Business Versions](resource.html#versions)
		 */
		url?: uri;
		/**
		 * May contain extended information for property: 'url'
		 */
		_url?: Element;
		/**
		 * The content was developed with a focus and intent of supporting the contexts that are listed. These terms may be used to assist with indexing and searching of code system definitions.
		 */
		useContext?: UsageContext[];
		/**
		 * May contain extended information for property: 'useContext'
		 */
		_useContext?: Element[];
		/**
		 * The identifier that is used to identify this version of the Topic when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the Topic author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions are orderable
		 */
		version?: string;
		/**
		 * May contain extended information for property: 'version'
		 */
		_version?: Element;
	}
	/**
	 * List of properties by which messages on the topic can be filtered
	 * From: topic-spreadsheet.xml
	 */
	export interface TopicCanFilterBy extends Element {
		/**
		 * Description of how this filter parameter is intended to be used.
		 */
		documentation?: markdown;
		/**
		 * May contain extended information for property: 'documentation'
		 */
		_documentation?: Element;
		/**
		 * A search parameter (like "patient") which is a label for the filter.
		 */
		name?: string;
		/**
		 * May contain extended information for property: 'name'
		 */
		_name?: Element;
	}
	/**
	 * The criteria for including updates to a nominated resource in the topic.  Thie criteria may be just a human readable description and/or a full FHIR search string or FHIRPath expression.
	 * From: topic-spreadsheet.xml
	 */
	export interface TopicResourceTrigger extends Element {
		/**
		 * The human readable description of what triggers inclusion into this topic -  for example, "Beginning of a clinical encounter".
		 */
		description?: string;
		/**
		 * May contain extended information for property: 'description'
		 */
		_description?: Element;
		/**
		 * The FHIRPath based rules that the server should use to determine when to trigger a notification for this topic.
		 */
		fhirPathCriteria?: string;
		/**
		 * May contain extended information for property: 'fhirPathCriteria'
		 */
		_fhirPathCriteria?: Element;
		/**
		 * The REST interaction based rules that the server should use to determine when to trigger a notification for this topic.
		 */
		methodCriteria?: code[];
		/**
		 * May contain extended information for property: 'methodCriteria'
		 */
		_methodCriteria?: Element[];
		/**
		 * The FHIR query based rules that the server should use to determine when to trigger a notification for this topic.
		 */
		queryCriteria?: TopicResourceTriggerQueryCriteria;
		/**
		 * May contain extended information for property: 'queryCriteria'
		 */
		_queryCriteria?: Element;
		/**
		 * The list of resource types that are candidates for this topic.  For example, the Encounter resource is updated in an 'admission' topic
		 */
		resourceType?: code[];
		/**
		 * May contain extended information for property: 'resourceType'
		 */
		_resourceType?: Element[];
	}
	/**
	 * The FHIR query based rules that the server should use to determine when to trigger a notification for this topic.
	 * From: topic-spreadsheet.xml
	 */
	export interface TopicResourceTriggerQueryCriteria extends Element {
		/**
		 * The FHIR query based rules are applied to the current resource state.
		 */
		current?: string;
		/**
		 * May contain extended information for property: 'current'
		 */
		_current?: Element;
		/**
		 * The FHIR query based rules are applied to the previous resource state.
		 */
		previous?: string;
		/**
		 * May contain extended information for property: 'previous'
		 */
		_previous?: Element;
		/**
		 *  If set to true, both current and previous criteria must evaluate true to  trigger a notification for this topic.  Otherwise a notification for this topic will be triggered if either one evaluates to true
		 */
		requireBoth?: boolean;
		/**
		 * May contain extended information for property: 'requireBoth'
		 */
		_requireBoth?: Element;
	}
	} // close module: fhir
	