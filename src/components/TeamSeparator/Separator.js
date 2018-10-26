import React, { Component } from 'react';
import 'react-bulma-components/src/index.sass';
import Container from 'react-bulma-components/lib/components/container';
import Heading from 'react-bulma-components/lib/components/heading';
import Section from 'react-bulma-components/lib/components/section';
import Progress from 'react-bulma-components/lib/components/progress'
import Generator from './Generator';

class Separator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSeparating: true,
            current: '',
            teams: this.props.teams,
            numJudges: this.props.numJudges,
            maxProgess: 100,
            progress: 0,
        };
    }

    componentDidMount() {
        this.startSeparator();
        this.showProgress();
    }

    showProgress = () => {
        const percent = this.state.progress + 1;
        if(percent > 100 && this.state.judgePairs){
            clearTimeout(this.tm);
            this.setState({
                isSeparating: false,
            });
            return;
        }else if(percent > 100){
            this.setState({
                progress: 0,
            }, () => {
                this.showProgress();
            });
        }
        this.setState({ 
            progress: percent,
        });
        this.tm = setTimeout(this.showProgress, 20);
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
        console.log('starting loop');
        while(teamWrappers.length > 0){
            //Adjust/reset judgePair index
            if(currJudgePair >= judgePairs.length){
                currJudgePair = 0;
                console.log('setting zero');
                
            }
            if(judgePairs[currJudgePair].teams.length >= maxPerJudge){
                currJudgePair++;
                console.log('inc');
                continue;
            }
            let currTeamWrapper = teamWrappers.pop();
            console.log("Team " + currTeamWrapper.team.teamID);
            console.log("timeUsed: " + currTeamWrapper.timeUsed);
            console.log("currJudge: " + currJudgePair);
            //Already has team
            if(judgePairs[currJudgePair].teams.filter(
                function(e) {
                    return e.teamID === currTeamWrapper.team.teamID;
                }).length > 0)
            {
                console.log('Already in: ' + currTeamWrapper.team.teamID + ":" + currJudgePair);
                teamWrappers.push(currTeamWrapper);
                currJudgePair++;
                continue;
            }else if(currTeamWrapper.timeUsed && (judgePairs[currJudgePair].teams.length+1) !== currTeamWrapper.timeUsed) {
                //Add team to judgePair
                judgePairs[currJudgePair].teams.push(currTeamWrapper.team);
                console.log('Scheduled ' + currTeamWrapper.team.teamID + ' to ' + currJudgePair);
            }else if(currTeamWrapper.timeUsed){
                //Conflict... Do not schedule and re-enqueue
                console.log('conflict: ' + currTeamWrapper.team.teamID + ":" + currJudgePair);
                teamWrappers.unshift(currTeamWrapper);
                continue;
            }else{
                //Add team's first time
                console.log('Scheduled first time ' + currTeamWrapper.team.teamID + ' to ' + currJudgePair);
                judgePairs[currJudgePair].teams.push(currTeamWrapper.team);
                currTeamWrapper.timeUsed = judgePairs[currJudgePair].teams.length;
                teamWrappers.unshift(currTeamWrapper);
            }
            currJudgePair++;
            console.log('inc2');
        }
        console.log('ended loop');
        this.setState({
            judgePairs: judgePairs,
        });
        console.log(judgePairs);
    }

    render() {
        const CurrentState = () => {
            if(this.state.isSeparating){
                //Progress Info
                let currentInfo = 'Separating ' + this.state.current + '...';
                return(
                    <div>
                        <Heading subtitle size={3}>{ currentInfo }</Heading>
                        <Progress max={100} value={this.state.progress} />
                    </div>
                );
            }
            //Start Generation
            return(
                <div>
                    <Generator judgePairs={this.state.judgePairs} />
                </div>
            );
        }

        return (
            <div>
                <Section>
                    <Container>
                        <CurrentState />
                    </Container>
                </Section>
            </div>
        );
    }
}

export default Separator;

