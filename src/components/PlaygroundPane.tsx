import * as React from 'react';

import {
  Card,
  Elevation, NonIdealState,
} from '@blueprintjs/core';


import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';

export class PlaygroundPane extends React.PureComponent<ContentPaneProps> {
  public render() {

		return(
		<div id='mainContent'>
			<Card elevation={Elevation.TWO}>
				<NonIdealState
					icon={IconNames.ISSUE}
					title='Not Implemented'
					description='Playground comming soon!
						Thank you for your patience.'
					/>
			</Card>
		</div>
		);
  }
}