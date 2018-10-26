import React, { Component } from 'react';
import 'react-bulma-components/src/index.sass';
import { Field, Control } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';
import Heading from 'react-bulma-components/lib/components/heading';
import { BlobProvider, Document, Page, Text, Image, View, StyleSheet } from '@react-pdf/renderer';
import hacklogo from '../../img/hackohiologo.png';
import colorpallete from '../../colorpallete.json';
import hexToRgba from 'hex-rgba';

class Generator extends Component {
    constructor(props) {
        super(props);
        const styles = StyleSheet.create({
            page: {
                padding: 10,
                backgroundColor: '#ffffff'
            },
            header: {
                flexDirection: 'row',
                borderBottomWidth: 2,
                borderBottomColor: '#bb0000',
                borderBottomStyle: 'solid',
                alignItems: 'stretch',
            },
            headerColumn: {
                flexDirection: 'column',
                flexGrow: 9,
            },
            headerTitleColumn: {
                flexDirection: 'column',
                flexGrow: 2,
                alignSelf: 'flex-end',
                justifySelf: 'flex-end',
            },
            headerText: {
                marginTop: 20,
                fontSize: 15,
            },
            logo: {
                width: '10%',
                padding: 5,
                alignSelf: 'flex-start',
                justifySelf: 'flex-start',
            },
            teamContainer: {
                padding: 10,
            },
            teamTitle: {
                flexGrow: 9,
                fontSize: 15,
            },
            teamInfo: {
                fontSize: 8,
            },
            teamColHead: {
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column',
                flexBasis: '25%',
                padding: 10,
            },
            teamCol: {
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column',
                flexBasis: '28.5%',
                padding: 10,
            },
            teamRow: {
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '100%',
            },
            mapSenate: {
                width: '65%',
            },
            mapGreatroom: {
                width: '65%',
            },
            mapBallroom: {
                width: '50%',
                alignSelf: 'flex-center',
                justifySelf: 'flex-center',
            },
            mapCol: {
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column',
                flexBasis: '50%',
                padding: 10,
            },
            mapRow: {
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '100%',
            },
            teamLoc: {
                fontSize: 10,
                textAlign: 'center',
                margin: 'auto',
                width: '80%',
            },
        });

        //Header mapping (can be implemented dynamically)
        /*const headerMap = {
            "team_name": "Team Name",
            "member_names": "Member Names",
            "member_emails": "Member Emails",
            "proj_name": "Project Goal",
            "proj_desc": "Functionality",
            "team_loc": "Location",
        };*/
        

        //Real HEADERMAP
        const headerMap = {
            "team_name": "Q3",
            "member_names": "Q4",
            "member_emails": "Q19",
            "proj_name": "Q31",
            "proj_desc": "Q13",
            "team_loc": "Q8",
            "team_pos": "Q29",
        };
        
        const infoHeader = "Separated and generated for " + this.props.judgePairs.length + " judge-pairs:";

        this.state = {
            styles: styles,
            judgePairs: this.props.judgePairs,
            infoHeader: infoHeader,
            headerMap: headerMap,
            loading: true,
            fetchingImages: true,
        };
        this.fetchImages();
    }

    fetchImages = () => {
        let judgePairs = this.state.judgePairs;
        let promises = [];
        for(let i=0; i<judgePairs.length; i++){
            let greathall = [];
            let ballroom = [];
            let senate = [];
            for(let j=0; j<judgePairs[i].teams.length; j++){
                let color = colorpallete[j];
                judgePairs[i].teams[j].color = color;
                let loc = judgePairs[i].teams[j][this.state.headerMap.team_loc];
                let pos = judgePairs[i].teams[j][this.state.headerMap.team_pos];
                switch(loc){
                    case 'Great Hall (1st floor)':
                        greathall.push({ color: hexToRgba(color.hex, 100), pos: pos });
                        judgePairs[i].teams[j].loc_ltr = 'G';
                        break;
                    case 'Grand Ballroom (2nd floor)':
                        ballroom.push({ color: hexToRgba(color.hex, 100), pos: pos });
                        judgePairs[i].teams[j].loc_ltr = 'B';
                        break;
                    case 'Senate Chamber (2nd floor)':
                        senate.push({ color: hexToRgba(color.hex, 100), pos: pos });
                        judgePairs[i].teams[j].loc_ltr = 'S';
                        break;
                    default:
                        break;
                }
            }
            let greathallQuery = '?r=gh';
            greathall.forEach((obj) => {
                greathallQuery += '&colors[]=' + obj.color + '&locs[]=' + obj.pos;
            });
            let ballroomQuery = '?r=br';
            ballroom.forEach((obj) => {
                ballroomQuery += '&colors[]=' + obj.color + '&locs[]=' + obj.pos;
            });
            let senateQuery = '?r=s';
            senate.forEach((obj) => {
                senateQuery += '&colors[]=' + obj.color + '&locs[]=' + obj.pos;
            });
            console.log(greathallQuery);
            console.log(ballroomQuery);
            console.log(senateQuery);

            promises.push(this.getAllImages(greathallQuery, ballroomQuery, senateQuery)
                .then(([gh, br, sn]) => {
                    judgePairs[i].greathall = URL.createObjectURL(gh);
                    judgePairs[i].ballroom = URL.createObjectURL(br);
                    judgePairs[i].senate = URL.createObjectURL(sn);
                })
            );
        }
        Promise.all(promises).then((vals) => {
            this.setState({
                judgePairs: judgePairs,
                fetchingImages: false,
            });
        });
    }

    getGreathall = (query) => {
        return fetch('/api/greathall' + query)
            .then(response => response.blob())
    }

    getBallroom = (query) => {
        return fetch('/api/ballroom' + query)
            .then(response => response.blob())
    }

    getSenate = (query) => {
        return fetch('/api/senate' + query)
            .then(response => response.blob())
    }

    getAllImages = (gh, br, sn) => {
        return Promise.all([this.getGreathall(gh), this.getBallroom(br), this.getSenate(sn)])
    }

    reloadPage = () => {
        window.location.reload();
    }

    render() {

        const JudgePage = (props) => (
            <Page size="A4" style={this.state.styles.page}>
                <View style={this.state.styles.header}>
                    <View style={this.state.styles.headerColumn}>
                    <Image
                        style={this.state.styles.logo}
                        src={hacklogo}
                    />
                    </View>
                    <View style={this.state.styles.headerTitleColumn}>
                        <Text style={this.state.styles.headerText}>Judge-pair {props.judgePair.id}   HackOhio {(new Date().getFullYear())}</Text> 
                    </View>
                </View>
                <View style={this.state.styles.teamContainer}>
                    {props.teams.map(function(team, index){
                        const colorStyle = StyleSheet.create({
                            teamColor: {
                                borderColor: team.color.word,
                                borderStyle: 'solid',
                                borderWidth: '10',
                                display: 'flex',
                                flexGrow: 1,
                                flexDirection: 'column',
                                flexBasis: '10%',
                                margin: 20,
                            },
                        });
                        return (
                            <View style={this.state.styles.teamRow}>
                                <View style={this.state.styles.teamColHead}>
                                    <Text style={this.state.styles.teamName}>{team[props.headerMap.team_name]}</Text>
                                    <Text style={this.state.styles.teamInfo}>Members:{"\n"}{team[props.headerMap.member_names]}</Text>
                                </View>
                                <View style={this.state.styles.teamCol}>
                                    <Text style={this.state.styles.teamInfo}>Project Name: {team[props.headerMap.proj_name]}</Text>
                                    <Text style={this.state.styles.teamInfo}>Project Desc: {team[props.headerMap.proj_desc]}</Text>
                                    <Text style={this.state.styles.teamInfo}>Location: {team[props.headerMap.team_loc]}</Text>
                                    <Text style={this.state.styles.teamInfo}>Identifier: {team[props.headerMap.team_pos]}</Text>
                                </View>
                                <View style={this.state.styles.teamCol}>
                                    <Text style={this.state.styles.teamInfo}>Emails:{"\n"}{team[props.headerMap.member_emails]}</Text>
                                </View>
                                <View style={colorStyle.teamColor}>
                                    <Text style={this.state.styles.teamLoc}>{team.loc_ltr}{team[props.headerMap.team_pos]}</Text>
                                </View>
                            </View>
                        );
                    }.bind(this))}
                </View>
                <View style={this.state.styles.mapRow}>
                    <View style={this.state.styles.mapCol}>
                        <Image
                            style={this.state.styles.mapGreatroom}
                            src={props.judgePair.greathall} />
                    </View>
                    <View style={this.state.styles.mapCol}>
                        <Image
                            style={this.state.styles.mapSenate}
                            src={props.judgePair.senate} />
                    </View>
                    <Image
                        style={this.state.styles.mapBallroom}
                        src={props.judgePair.ballroom} />
                </View>
            </Page>
        );

        const GeneratedPDFs = (
            <Document>
                {this.state.judgePairs.map(function(judgePair, index){
                    return <JudgePage judgePair={judgePair} teams={judgePair.teams} headerMap={this.state.headerMap} />
                }.bind(this))}
            </Document>
        );

        const DownloadContainer = () => (
            <div>
                <BlobProvider document={GeneratedPDFs}>
                    {({ blob, url, loading, error }) => (
                        loading ? 
                            <Heading subtitle size={4}>Generating PDFs...</Heading> 
                            :
                            <div>
                                <Field>
                                    <Control>
                                        <Heading subtitle size={4}>{this.state.infoHeader}</Heading>
                                    </Control>
                                </Field>
                                <Field kind="group">
                                    <Control>
                                        <a href={url} target="_blank" rel="noopener noreferrer"><Button>Download</Button></a>
                                    </Control>
                                    <Control>
                                        <Button color="danger" onClick={this.reloadPage}>Restart</Button>
                                    </Control>
                                </Field>
                            </div>
                    )}
                </BlobProvider>
            </div>
        );

        if(this.state.fetchingImages){
            return (
                <div>
                    <Heading subtitle size={4}>Generating custom images...</Heading>
                </div>
            );
        }else{
            return (
                <div>
                    <DownloadContainer />
                </div>
            );
        }

    }

}
export default Generator;
