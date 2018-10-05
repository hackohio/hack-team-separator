import React, { Component } from 'react';
import 'react-bulma-components/src/index.sass';
import Container from 'react-bulma-components/lib/components/container';
import Heading from 'react-bulma-components/lib/components/heading';
import Section from 'react-bulma-components/lib/components/section';
import Progress from 'react-bulma-components/lib/components/progress'

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
            maxProgess: 100,
            progress: 0,
        };
        this.startSeparator();
    }

    startSeparator = () => {
        const judgingEvents = this.state.teams.length*2;
        const maxPerJudge = Math.ceil(judgingEvents/this.state.numJudges);
        let teamWrappers = [];
        let judgePairs = [];
        let teamID = 0;
        this.state.teams.forEach((team) => {
            team.teamID = teamID;
            let newWrapper = {
                "timeUsed": null,
                "team": team,
            };
            teamWrappers.unshift(newWrapper);
            teamID++;
        });
        for(let i=1; i<=this.state.numJudges; i++){
            let newJudgePair = {
                "id": i,
                "teams": [],
            };
            judgePairs.push(newJudgePair);
        }
        let currJudgePair = 0;
        while(teamWrappers.length > 0){
            //Adjust/reset judgePair index
            if(currJudgePair >= judgePairs.length)
                currJudgePair = 0;
            if(judgePairs[currJudgePair].teams.length >= maxPerJudge){
                currJudgePair++;
                continue;
            }
            let currTeamWrapper = teamWrappers.pop();
            //Already has team
            if(judgePairs[currJudgePair].teams.filter(
                function(e) {
                    return e.teamID === currTeamWrapper.team.teamID;
                }).length > 0)
            {
                teamWrappers.unshift(currTeamWrapper);
                continue;
            }else if(currTeamWrapper.timeUsed && judgePairs[currJudgePair].teams.length !== currTeamWrapper.timeUsed) {
                //Add team to judgePair
                judgePairs[currJudgePair].teams.push(currTeamWrapper.team);
            }else if(currTeamWrapper.timeUsed){
                //Conflict... Do not schedule and re-enqueue
                teamWrappers.unshift(currTeamWrapper);
                continue;
            }else{
                //Add team's first time
                judgePairs[currJudgePair].teams.push(currTeamWrapper.team);
                currTeamWrapper.timeUsed = judgePairs[currJudgePair].teams.length;
                teamWrappers.unshift(currTeamWrapper);
            }
            currJudgePair++;
        }
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

