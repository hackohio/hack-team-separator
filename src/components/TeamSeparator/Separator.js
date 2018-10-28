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
        /*
        let sponsorChallenges = {
            "AEP": {
                teams: [],
            },
            "AgTech": {
                teams: [],
            },
            "ENGIE": {
                teams: [],
            },
            "Honda": {
                teams: [],
            },
            "JPMC": {
                teams: [],
            },
            "Microsoft": {
                teams: [],
            },
        };
        */
        let sponsorChallenges = [
            {
                name: 'AEP',
                teams: [],
            },
            {
                name: 'AgTech',
                teams: [],
            },
            {
                name: 'ENGIE',
                teams: [],
            },
            {
                name: 'Honda',
                teams: [],
            },
            {
                name: 'JPMC',
                teams: [],
            },
            {
                name: 'Microsoft',
                teams: [],
            },
        ];
        let teamID = 0;
        this.state.teams.forEach((team) => {
            team.teamID = teamID;
            let newWrapper = {
                "timeUsed": null,
                "team": team,
            };
            switch(team["Q21"]){
                case "AEP":
                    sponsorChallenges[0].teams.push(newWrapper.team);
                    break;
                case "AgTech":
                    sponsorChallenges[1].teams.push(newWrapper.team);
                    break;
                case "ENGIE":
                    sponsorChallenges[2].teams.push(newWrapper.team);
                    break;
                case "Honda":
                    sponsorChallenges[3].teams.push(newWrapper.team);
                    break;
                case "JP Morgan & Chase":
                    sponsorChallenges[4].teams.push(newWrapper.team);
                    break;
                case "Microsoft":
                    sponsorChallenges[5].teams.push(newWrapper.team);
                    break;
                default:
                    break;
            }
            teamWrappers.unshift(newWrapper);
            teamID++;
        });
        console.log(sponsorChallenges);
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
            if(currJudgePair >= judgePairs.length){
                currJudgePair = 0;
            }
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
                teamWrappers.push(currTeamWrapper);
                currJudgePair++;
                continue;
            }else if(currTeamWrapper.timeUsed && (judgePairs[currJudgePair].teams.length+1) !== currTeamWrapper.timeUsed) {
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
        this.setState({
            judgePairs: judgePairs,
            sponsorChallenges: sponsorChallenges,
        });
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
                    <Generator judgePairs={this.state.judgePairs} sponsorChallenges={this.state.sponsorChallenges} />
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

