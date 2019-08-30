import * as React from 'react';

// import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';
import { Card, Elevation, NonIdealState } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

export default function Scenario2Pane(props: ContentPaneProps) {
  return(
		<div id='mainContent'>
			<Card elevation={Elevation.TWO}>
				<NonIdealState
					icon={IconNames.ISSUE}
					title='Not Implemented'
          description='Scenario 2 has not yet been implemented in the User Interface.
            Thank you for your patience.'
					/>
			</Card>
		</div>
  );
}
