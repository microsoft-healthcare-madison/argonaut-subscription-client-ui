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
import NpmInstallDevDays from './NpmInstallDevDays';
import ChangeDirectoryDevDays from './ChangeDirectory';

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
	
	const [changeDirectoryData, setChangeDirectoryData] = useState<SingleRequestData[]>([]);
	const [changeDirectoryStatus, setChangeDirectoryStatus] = useState<DataCardStatus>(_statusNotAvailable);

	const [npmInstallData, setNpmInstallData] = useState<SingleRequestData[]>([]);
	const [npmInstallStatus, setNpmInstallStatus] = useState<DataCardStatus>(_statusNotAvailable);

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

	const [showEndpointProxy, setShowEndpointProxy] = useState<boolean>(false);

	const _languageInfoJsProxy: DevDaysLanguageInfo = {
		cloneCommand: 'git clone https://github.com/microsoft-healthcare-madison/devdays-2019-subscription-node.git',
		directoryName: 'devdays-2019-subscription-node',
		endpointLineFilename: 'app.js',
		endpointLineNumber: 11,
		startCommand: 'npm start'
	};

	const _languageInfoJsTunnel: DevDaysLanguageInfo = {
		cloneCommand: 'git clone --branch tunnel https://github.com/microsoft-healthcare-madison/devdays-2019-subscription-node.git',
		directoryName: 'devdays-2019-subscription-node',
		endpointLineFilename: 'app.js',
		endpointLineNumber: 11,
		startCommand: 'npm start'
	};

	const _languageInfoCsProxy: DevDaysLanguageInfo = {
		cloneCommand: 'git clone https://github.com/microsoft-healthcare-madison/devdays-2019-subscription-cs.git',
		directoryName: 'devdays-2019-subscription-cs',
		endpointLineFilename: 'appsettings.json',
		endpointLineNumber: 3,
		startCommand: 'dotnet run --project devdays-2019-subscription-cs\\devdays-2019-subscription-cs.csproj'
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
		let notificationType:string = '';
		
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

		switch (bundle.type) {
			case fhir.BundleTypeCodes.HISTORY:
				if ((bundle) &&
						(bundle.meta) &&
						(bundle.meta.extension))
				{
					bundle.meta.extension.forEach(element => {
						if (element.url.endsWith('subscription-event-count')) {
							eventCount = element.valueUnsignedInt!;
						} else if (element.url.endsWith('bundle-event-count')) {
							bundleEventCount = element.valueUnsignedInt!;
						} else if (element.url.endsWith('subscription-status')) {
							status = element.valueString!;
						} else if (element.url.endsWith('subscription-topic-url')) {
							topicUrl = element.valueUrl!;
						} else if (element.url.endsWith('subscription-url')) {
							subscriptionUrl = element.valueUrl!;
						}
					});
				}
			break;

			case fhir.BundleTypeCodes.SUBSCRIPTION_NOTIFICATION:
				if ((bundle) &&
						(bundle.entry) &&
						(bundle.entry[0]) &&
						(bundle.entry[0].resource))
				{
					let subscriptionStatus = bundle.entry[0].resource as fhir.SubscriptionStatus;

					if (subscriptionStatus.eventsSinceSubscriptionStart) {
						eventCount = Number(subscriptionStatus.eventsSinceSubscriptionStart!);
					}

					if (subscriptionStatus.eventsInNotification) {
						bundleEventCount = Number(subscriptionStatus.eventsInNotification!);
					}

					if (subscriptionStatus.status) {
						status = subscriptionStatus.status!;
					}

					if ((subscriptionStatus.topic) && (subscriptionStatus.topic.reference)) {
						topicUrl = subscriptionStatus.topic.reference!;
					}

					if (subscriptionStatus.subscription.reference) {
						subscriptionUrl = subscriptionStatus.subscription.reference!;
					}

					notificationType = subscriptionStatus.notificationType;
					if (notificationType === fhir.SubscriptionStatusNotificationTypeCodes.HANDSHAKE) {
						eventCount = 0;
						bundleEventCount = 0;
					} else if (notificationType === fhir.SubscriptionStatusNotificationTypeCodes.HEARTBEAT) {
						bundleEventCount = 0;
					}
				}
			break;
		}

		// **** add to our display ****

		let rec:SingleRequestData = {
			id:`event_${notificationData.length}`, 
			name: `Notification #${notificationData.length}`,
			responseData: JSON.stringify(bundle, null, 2),
			responseDataType: RenderDataAsTypes.FHIR,
			info: `${(eventCount === 0) ? 'Handshake' : 'Notification'} #${notificationData.length}:\n`+
				`\tSubscriptionTopic: ${topicUrl}\n` +
				`\tSubscription:      ${subscriptionUrl}\n` +
				`\tStatus:            ${status}\n` +
				`\tBundle Events:     ${bundleEventCount}\n`+
				`\tTotal Events:      ${eventCount}`,
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
      headers.append('Accept', 'application/fhir+json');
      headers.append('Content-Type', 'application/fhir+json');
      let response: Response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: message,
      });
    } catch (err) {
			console.log(`Forwarding notification to ${url} failed: ${err}`);
    }
	}

	function getPrettyLang(lang: string) {
		switch (lang) {
			case 'jsp': return 'JavaScript (Node) with Proxy';
			case 'jst': return 'JavaScript (Node) with local tunneling';
			case 'csp': return 'C# (Kestrel) with Proxy';
		}
	}

	function getLanObj(lang: string):DevDaysLanguageInfo {
		switch (lang) {
			case 'jsp': return _languageInfoJsProxy;
			case 'jst': return _languageInfoJsTunnel;
			case 'csp': return _languageInfoCsProxy;
		}
		return {cloneCommand:'', endpointLineFilename:'', endpointLineNumber:0, startCommand:'', directoryName:''};
	}

	/** Set the current programming language (based on user selection) */
  function updateProgrammingLanguage(lang: string) {
		setProgrammingLanguage(lang);
		setLangStatus(_statusComplete);
		
		switch (lang) {
			case 'jst': setShowEndpointProxy(false); break;
			default: setShowEndpointProxy(true); break;
		}

		// **** update data for the repo step ****

		let rec:SingleRequestData = {
			id: 'repo_for_pl',
			name: `Clone Repository for ${lang}`,
			info: getLanObj(lang).cloneCommand,
		}
		setRepoData([rec]);
		setRepoStatus(_statusAvailable);
	}
	
	function enableStartLocal() {
		let rec:SingleRequestData = {
			id: 'start_local',
			name: 'Start the local hosting process',
			info: getLanObj(programmingLanguage).startCommand,
		}
		setStartLocalData([rec]);
		setStartLocalStatus(_statusAvailable);
	}

	function enableNpmInstall() {
		let rec:SingleRequestData = {
			id: 'install dependencies',
			name: 'Install node module dependencies',
			info: 'npm install',
		}
		setNpmInstallData([rec]);
		setNpmInstallStatus(_statusAvailable);
	}

	function enableChangeDirectory() {
		let rec:SingleRequestData = {
			id: 'change directory',
			name: 'Move into the cloned repo',
			info: `cd ${getLanObj(programmingLanguage).directoryName}`,
		}
		setChangeDirectoryData([rec]);
		setChangeDirectoryStatus(_statusAvailable);
	}

	/** Process the user saying they cloned the repository */
  function registerCloned() {
		setRepoStatus(_statusComplete);
		enableChangeDirectory();
	}

	function registerDirectoryChanged() {
		setChangeDirectoryStatus(_statusComplete);

		if (programmingLanguage.startsWith('js')) {
			enableNpmInstall();
		} else if (showEndpointProxy) {
			setEndpointStatus(_statusAvailable);
		} else {
			enableStartLocal();
		}
	}
	
	function registerInstalled() {
		setNpmInstallStatus(_statusComplete);

		if (showEndpointProxy) {
			setEndpointStatus(_statusAvailable);
		} else {
			enableStartLocal();
		}
	}

	function getEndpointCodeData(endpoint:EndpointRegistration):SingleRequestData {
		switch (programmingLanguage) {
			case 'jsp':
				setCodeEndpointLineNumber(_languageInfoJsProxy.endpointLineNumber);
				setCodeEndpointFilename(_languageInfoJsProxy.endpointLineFilename);
				return {
					id: 'set_endpoint_for_pl',
					name: `Set Endpoint in Code for ${getPrettyLang(programmingLanguage)}`,
					info: `const publicUrl = '${props.clientHostInfo.url}Endpoints/${endpoint.uid}/';`,
				};
				case 'jst':
						setCodeEndpointLineNumber(_languageInfoJsTunnel.endpointLineNumber);
						setCodeEndpointFilename(_languageInfoJsTunnel.endpointLineFilename);
						return {
							id: 'set_endpoint_for_pl',
							name: `Set Endpoint in Code for ${getPrettyLang(programmingLanguage)}`,
							info: `const publicUrl = '${props.clientHostInfo.url}Endpoints/${endpoint.uid}/';`,
						};
				case 'csp':
					setCodeEndpointLineNumber(_languageInfoCsProxy.endpointLineNumber);
					setCodeEndpointFilename(_languageInfoCsProxy.endpointLineFilename);
					return {
						id: 'set_endpoint_for_pl',
						name: `Set Endpoint in Code for ${getPrettyLang(programmingLanguage)}`,
						info: `  "Basic_Public_Url": "${props.clientHostInfo.url}Endpoints/${endpoint.uid}/",`,
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
		enableStartLocal();
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
					Guide through a <b>basic</b> tutorial on Subscriptions.<br/>
					More information can be found in the presentations <a 
					href='http://aka.ms/devdays-gino' 
					target='_blank'
					rel="noopener noreferrer"
					>here</a>.
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
        registerDone={registerCloned}
        />

			<ChangeDirectoryDevDays
        key='devdays_change_directory'
        paneProps={props}
        status={changeDirectoryStatus}
        data={changeDirectoryData}
        registerDone={registerDirectoryChanged}
        />
			
			{ (programmingLanguage.startsWith('js')) &&
				<NpmInstallDevDays
					key='devdays_npm_install'
					paneProps={props}
					status={npmInstallStatus}
					data={npmInstallData}
					registerDone={registerInstalled}
					/>
			}

			{ showEndpointProxy &&
				<>
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
						registerDone={registerEndpointSet}
						/>
				</>
			}

			<StartLocalDevDays
				key='devdays_start_local'
				paneProps={props}
				status={startLocalStatus}
				data={startLocalData}
				language={programmingLanguage}
				registerDone={registerStarted}
				/>

		{ showEndpointProxy &&
			<NotificationDevDays
				key='devdays_notification'
				paneProps={props}
				status={notificationStatus}
				data={notificationData}
				/>
			}

		</div>
	);


}