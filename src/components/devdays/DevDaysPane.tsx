import React, {useState, useEffect} from 'react';

import {
  Card,
  Elevation, NonIdealState, H3, Text,
} from '@blueprintjs/core';

import * as fhir from '../../models/fhir_r4_selected';
import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardStatus } from '../../models/DataCardStatus';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import NotificationDevDays from './NotificationDevDays';
import EndpointDevDays from './EndpointDevDays';
import LanguageChoiceDevDays from './LanguageChoiceDevDays';
import CloneRepoDevDays from './CloneRepoDevDays';
import SetEndpointDevDays from './SetEndpointDevDays';
import { DevDaysLanguageInfo } from '../../models/DevDaysLanguageInfo';
import StartLocalDevDays from './StartLocalDevDays';

export default function DevDaysPane(props: ContentPaneProps) {

	const _statusAvailable: DataCardStatus = {available: true, complete: false, busy: false};
	const _statusNotAvailable: DataCardStatus = {available: false, complete: false, busy: false};
	const _statusBusy: DataCardStatus = {available: true, complete: false, busy: true};
	const _statusComplete: DataCardStatus = {available: true, complete: true, busy: false};

	const [connected, setConnected] = useState<boolean>(true);

  const [langData, setLangData] = useState<SingleRequestData[]>([]);
  const [langStatus, setLangStatus] = useState<DataCardStatus>(_statusAvailable);
  const [programmingLanguage, setProgrammingLanguage] = useState<string>('');

  const [repoData, setRepoData] = useState<SingleRequestData[]>([]);
  const [repoStatus, setRepoStatus] = useState<DataCardStatus>(_statusNotAvailable);

	const [endpointData, setEndpointData] = useState<SingleRequestData[]>([]);
	const [endpointStatus, setEndpointStatus] = useState<DataCardStatus>(_statusNotAvailable);
  const [endpoints, setEndpoints] = useState<EndpointRegistration[]>([]);
	
	const [codeEndpointData, setCodeEndpointData] = useState<SingleRequestData[]>([]);
	const [codeEndpointStatus, setCodeEndpointStatus] = useState<DataCardStatus>(_statusNotAvailable);
	const [codeEndpointLineNumber, setCodeEndpointLineNumber] = useState<number>(-1);
	const [codeEndpointFilaname, setCodeEndpointFilename] = useState<string>('');

	const [startLocalData, setStartLocalData] = useState<SingleRequestData[]>([]);
	const [startLocalStatus, setStartLocalStatus] = useState<DataCardStatus>(_statusNotAvailable);

  const [notificationData, setNotificationData] = useState<SingleRequestData[]>([]);
	const [notificationStatus, setNotificationStatus] = useState<DataCardStatus>(_statusAvailable);

	const _languageInfoJs: DevDaysLanguageInfo = {
		cloneCommand: 'git clone https://github.com/microsoft-healthcare-madison/devdays-2019-subscription-node.git',
		endpointLineFilename: 'basic-server/app.js',
		endpointLineNumber: 9,
		startCommand: 'cd basic-server\nnpm start'
	};

	const _languageInfoCs: DevDaysLanguageInfo = {
		cloneCommand: 'git clone https://github.com/microsoft-healthcare-madison/devdays-2019-subscription-cs.git',
		endpointLineFilename: 'program.cs',
		endpointLineNumber: -1,
		startCommand: 'dotnet devdays-2019-subscription-cs.dll'
	};

	useEffect(() => {
		/** Determine if the client is connected enough to proceed and update state accordingly */
		function checkIfConnected() {
			let lastState: boolean = connected;
			let nextState: boolean;

			// **** check to make sure we are connected to the host (requires server) ****

			if (props.clientHostInfo.status !== 'ok') {
				nextState = false;
			} else {
				nextState = true;
			}

			// **** update state (if necessary) ****

			if (lastState !== nextState) {
				setConnected(nextState);
			}
		}

		checkIfConnected();

		props.registerHostMessageHandler(handleHostMessage);
	});

	// **** check for not being connected ****

	if (!connected) {
	return(
		<div id='mainContent'>
			<Card elevation={Elevation.TWO}>
				<NonIdealState
					icon={IconNames.ISSUE}
					title='Not Connected'
					description='You must be connected to a FHIR Server and Client Host before continuing.'
					/>
			</Card>
		</div>
		);
	}

	/** Callback function to process ClientHost messages */
	function handleHostMessage(message: string) {
		// **** vars we want ****

		let eventCount: number = NaN;
		let bundleEventCount: number = NaN;
		let status: string = '';
		let topicUrl: string = '' ;
		let subscriptionUrl: string = '';

		let bundle: fhir.Bundle;

		// **** check for a ping ****

		if (message.startsWith('ping')) {
			return;
		}

		// **** resolve this message into a bundle ****

		try {
			bundle = JSON.parse(message);
		} catch(error) {
			// **** assume non-bundle message got through ****
			return;
		}

		// **** attempt to forward this to a local client ****

		forwardNotificationToLocalhost('http://localhost:32019/notification', message);

		// **** check for the extensions we need ****

		if ((bundle) &&
				(bundle.meta) &&
				(bundle.meta.extension))
		{
			bundle.meta.extension.forEach(element => {
				if (element.url.endsWith('subscriptionEventCount') ||
						element.url.endsWith('subscription-event-count')) {
					eventCount = element.valueDecimal!;
				} else if (element.url.endsWith('bundleEventCount') ||
									 element.url.endsWith('bundle-event-count')) {
					bundleEventCount = element.valueUnsignedInt!;
				} else if (element.url.endsWith('subscriptionStatus') ||
									 element.url.endsWith('subscription-status')) {
					status = element.valueString!;
				} else if (element.url.endsWith('subscriptionTopicUrl') ||
									 element.url.endsWith('subscription-topic-url')) {
					topicUrl = element.valueUrl!;
				} else if (element.url.endsWith('subscriptionUrl') ||
									 element.url.endsWith('subscription-url')) {
					subscriptionUrl = element.valueUrl!;
				}
			});
		}

		// **** add to our display ****

		let rec:SingleRequestData = {
			id:`event_${notificationData.length}`, 
			name: `Notification #${notificationData.length}`,
			responseData: JSON.stringify(bundle, null, 2),
			responseDataType: RenderDataAsTypes.FHIR,
			info: `${(eventCount === 0) ? 'Handshake' : 'Notification'} #${notificationData.length}:\n`+
				`\tTopic:         ${topicUrl}\n` +
				`\tSubscription:  ${subscriptionUrl}\n` +
				`\tStatus:        ${status}\n` +
				`\tBundle Events: ${bundleEventCount}\n`+
				`\tTotal Events:  ${eventCount}`,
		}

		let data: SingleRequestData[] = notificationData.slice();
		data.push(rec);

		// **** update our state ****

		setNotificationData(data);
	}

	/** attempt to forward a received notification to a DevDays sample application */
	async function forwardNotificationToLocalhost(url:string, message: string) {
		try {
      let headers: Headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      let response: Response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: message,
      });
    } catch (err) {
			console.log(`Forwarding notification to ${url} failed: ${err}`);
    }
	}

	/** Get the correct git clone command for the selected language */
	function getGitCloneCommand(lang: string) {
		switch (lang) {
			case 'js': return _languageInfoJs.cloneCommand;
			case 'cs': return _languageInfoCs.cloneCommand;
		}
		return 'No repository for this language'
	}

	/** Set the current programming language (based on user selection) */
  function updateProgrammingLanguage(lang: string) {
		setProgrammingLanguage(lang);
		setLangStatus(_statusComplete);
		
		// **** update data for the repo step ****

		let rec:SingleRequestData = {
			id: 'repo_for_pl',
			name: `Clone Repository for ${lang}`,
			info: getGitCloneCommand(lang),
		}
		setRepoData([rec]);
    setRepoStatus(_statusAvailable);
	}
	
	function getStartCommand() {
		switch (programmingLanguage) {
			case 'js': return _languageInfoJs.startCommand;
			case 'cs': return _languageInfoCs.startCommand;
		}

		return `Unsupported language: ${programmingLanguage}`;
	}

	/** Process the user saying they cloned the repository */
  function registerCloned() {
    setRepoStatus(_statusComplete);
		setEndpointStatus(_statusAvailable);
		
		let startRec:SingleRequestData = {
			id: 'start_local',
			name: `Start the local hosting process`,
			info: getStartCommand(),
		}
		setStartLocalData([startRec]);
		setStartLocalStatus(_statusAvailable);
	}
	
	function getEndpointCodeData(endpoint:EndpointRegistration):SingleRequestData {
		switch (programmingLanguage) {
			case 'js':
				setCodeEndpointLineNumber(_languageInfoJs.endpointLineNumber);
				setCodeEndpointFilename(_languageInfoJs.endpointLineFilename);
				return {
					id: 'set_endpoint_for_pl',
					name: `Set Endpoint in Code for ${programmingLanguage}`,
					info: `const publicUrl = '${props.clientHostInfo.url}Endpoints/${endpoint.uid}/';`,
				};
			case 'cs':
					setCodeEndpointLineNumber(_languageInfoCs.endpointLineNumber);
					setCodeEndpointFilename(_languageInfoCs.endpointLineFilename);
					return {
						id: 'set_endpoint_for_pl',
						name: `Set Endpoint in Code for ${programmingLanguage}`,
						info: `const publicUrl = '${props.clientHostInfo.url}Endpoints/${endpoint.uid}/';`,
					};
		}
		return {
			id: 'set_endpoint_for_pl',
			name: `Set Endpoint error`,
			info: `Unsupported language: ${programmingLanguage}`,
		};
	}

	function registerEndpoints(endpoints: EndpointRegistration[]) {
		setEndpoints(endpoints);
		// **** check if we have one ****

		if (endpoints.length > 0) {
			setCodeEndpointStatus(_statusAvailable);
			let rec:SingleRequestData = getEndpointCodeData(endpoints[0]);
			setCodeEndpointData([rec]);
		}
	}

	function registerEndpointSet() {
		// **** update data for the set endpoint step ****

		setCodeEndpointStatus(_statusComplete);
	}

	function registerStarted() {
		setStartLocalStatus(_statusComplete);
	}

	// **** if we are connected, render scenario content ****
	return (
		<div id='mainContent'>
			<Card key='title' elevation={Elevation.TWO} style={{margin: 5}}>
				<Text>
					<H3>DevDays Walkthrough</H3>
					Guide through a <b>basic</b> tutorial on Subscriptions
				</Text>
				</Card>

      <LanguageChoiceDevDays
        key='devdays_language'
        paneProps={props}
        status={langStatus}
        data={langData}
        language={programmingLanguage}
        setLanguage={updateProgrammingLanguage}
        />

      <CloneRepoDevDays
        key='devdays_clone_repo'
        paneProps={props}
        status={repoStatus}
        data={repoData}
        language={programmingLanguage}
        registerCloned={registerCloned}
        />

			<EndpointDevDays
				key='devdays_endpoint'
				paneProps={props}
				status={endpointStatus}
				updateStatus={setEndpointStatus}
				data={endpointData}
				setData={setEndpointData}
				endpoints={endpoints}
				setEndpoints={registerEndpoints}
				/>

			<SetEndpointDevDays
				key='devdays_set_endpoint'
				paneProps={props}
				status={codeEndpointStatus}
				data={codeEndpointData}
				endpointCodeLineNumber={codeEndpointLineNumber}
				endpointCodeFilename={codeEndpointFilaname}
				endpoints={endpoints}
				registerEndpointSet={registerEndpointSet}
				/>
			
			<StartLocalDevDays
				key='devdays_start_local'
				paneProps={props}
				status={startLocalStatus}
				data={startLocalData}
				language={programmingLanguage}
				registerStarted={registerStarted}
				/>

			<NotificationDevDays
				key='devdays_notification'
				paneProps={props}
				status={notificationStatus}
				data={notificationData}
				/>

		</div>
	);


}