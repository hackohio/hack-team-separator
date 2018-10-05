import React, { Component } from 'react';
import 'react-bulma-components/src/index.sass';
import Container from 'react-bulma-components/lib/components/container';
import Heading from 'react-bulma-components/lib/components/heading';
import Section from 'react-bulma-components/lib/components/section';
import Progress from 'react-bulma-components/lib/components/progress';

class Generator extends Component {
    constructor(props) {
        super(props);

        //Header mapping (temporarily here)
        let headerMap = {
            "team_name": "Team Name",
            "member_names": "Member Names",
            "member_emails": "Member Emails",
            "proj_goal": "Project Goal",
            "proj_func": "Functionality",
        };

        this.state = {
            isGenerating: true,
            current: '',
            headers: headerMap,
            teams: this.props.teams,
            numJudges: this.props.numJudges,
            progress: 0,
        };
        console.log(this.state.teams);
        this.startSeparator();
    }

    startSeparator = () => {

    }

    render() {
        const ProgressInfo = () => {
            if(this.state.isGenerating){
                let currentInfo = 'Generating ' + this.state.current + '...';
                return(
                    <div>
                        <Heading subtitle size={3}>{ currentInfo }</Heading>
                        <Progress max={100} value={this.state.progress} />
                    </div>
                );
            }
            return null;
        }

        return (
            <div>
                <Section>
                    <Container>
                        <ProgressInfo />
                    </Container>
                </Section>
            </div>
        );
    }
}

export default Generator;

