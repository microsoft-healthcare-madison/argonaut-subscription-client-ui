import React, {useState, useEffect} from 'react';

import {
  Card,
  Elevation, NonIdealState, H3, Text,
} from '@blueprintjs/core';

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
import { NotificationHelper, NotificationReturn } from '../../util/NotificationHelper';

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
		cloneCommand: 'git clone https://github.com/microsoft-healthcare-madison/devdays-2019-subscription-node.git',
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
		// check for an R4-Websocket ping
		if (message.startsWith('ping')) {
			return;
		}

		// attempt to parse into a bundle
		let notificationReturn:NotificationReturn = NotificationHelper.ParseNotificationMessage(
			props.useBackportToR4,
			message
		);

		if (!notificationReturn.success) {
			// ignore
			return;
		}

		// attempt to forward this to a local client
		forwardNotificationToLocalhost('http://localhost:32019/notification', message);

		let rec:SingleRequestData = {
			id:`event_${notificationData.length}`, 
			name: `Notification #${notificationData.length}`,
			responseData: JSON.stringify(notificationReturn.bundle, null, 2),
			responseDataType: RenderDataAsTypes.FHIR,
			info: `Notification #${notificationData.length}:\n`+
				`\tSubscription:      ${notificationReturn.subscription}\n` +
				`\tSubscriptionTopic: ${notificationReturn.topicUrl}\n` +
				`\tType:              ${notificationReturn.notificationType}\n` +
				`\tStatus:            ${notificationReturn.status}\n` +
				`\tBundle Events:     ${notificationReturn.eventsInNotification}\n`+
				`\tTotal Events:      ${notificationReturn.eventsSinceSubscriptionStart}`,
		}

		let data: SingleRequestData[] = notificationData.slice();
		data.push(rec);
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