import React, { Component } from 'react';
import 'react-bulma-components/src/index.sass';
import { Field, Control } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';
import Heading from 'react-bulma-components/lib/components/heading';
import { BlobProvider, Document, Page, Text, Image, View, StyleSheet } from '@react-pdf/renderer';
import makelogo from '../../img/makelogo.png';

class Generator extends Component {
    constructor(props) {
        super(props);
        this.setState({
            isLoading: true,
        });
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

        let headerMap = {
            "team_name": "Q3",
            "team_number": "Q16",
            "member_1": "Q4",
            "member_email_1": "Q5",
            "member_2": "Q20",
            "member_email_2": "Q22",
            "member_3": "Q23",
            "member_email_3": "Q21",
            "member_4": "Q24",
            "member_email_4": "Q25",
            "proj_desc": "Q13",
        };
        
        const infoHeader = "Separated and generated for " + this.props.judgePairs.length + " judge-pairs:";

        this.state = {
            styles: styles,
            judgePairs: this.props.judgePairs,
            infoHeader: infoHeader,
            headerMap: headerMap,
            isLoading: false,
        };
        console.log(this.props.judgePairs);
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
                        src={makelogo}
                    />
                    </View>
                    <View style={this.state.styles.headerTitleColumn}>
                        <Text style={this.state.styles.headerText}>Judge-pair {props.judgePair.id}   MakeOhio {(new Date().getFullYear())}</Text> 
                    </View>
                </View>
                <View style={this.state.styles.teamContainer}>
                    {props.teams.map(function(team, index){
                        const colorStyle = StyleSheet.create({
                            teamColor: {
                                borderColor: 'black',
                                borderStyle: 'solid',
                                borderWidth: '10',
                                display: 'flex',
                                flexGrow: 1,
                                flexDirection: 'column',
                                flexBasis: '10%',
                                margin: 20,
                            },
                        });
                        console.log('Mapping judge');
                        console.log(team);
                        Object.keys(props.headerMap).forEach((key) => {
                            let header = props.headerMap[key];
                            if(!team[header])
                                team[header] = 'N/A';
                        });
                        // props.headerMap.forEach((column) => {
                            // if(!team[column])
                                // team[column] = 'N/A';
                        // });
                        return (
                            <View style={this.state.styles.teamRow} key={index}>
                                <View style={this.state.styles.teamColHead}>
                                    <Text style={this.state.styles.teamName}>{team[props.headerMap.team_name]}</Text>
                                    <Text style={this.state.styles.teamInfo}>Members:{"\n"}{team[props.headerMap.member_1]}{"\n"}{team[props.headerMap.member_2]}{"\n"}{team[props.headerMap.member_3]}{"\n"}{team[props.headerMap.member_4]}</Text>
                                </View>
                                <View style={this.state.styles.teamCol}>
                                    <Text style={this.state.styles.teamInfo}>Project Desc: {team[props.headerMap.proj_desc]}</Text>
                                </View>
                                <View style={this.state.styles.teamCol}>
                                    <Text style={this.state.styles.teamInfo}>Emails:{"\n"}{team[props.headerMap.member_email_1]}{"\n"}{team[props.headerMap.member_email_2]}{"\n"}{team[props.headerMap.member_email_3]}{"\n"}{team[props.headerMap.member_email_4]}</Text>
                                </View>
                                <View style={colorStyle.teamColor}>
                                    <Text style={this.state.styles.teamLoc}>{team[props.headerMap.team_number]}</Text>
                                </View>
                            </View>
                        );
                    }.bind(this))}
                </View>
            </Page>
        );


        const GeneratedPDFs = (
            <Document>
                {this.state.judgePairs.map(function(judgePair, index){
                    return <JudgePage judgePair={judgePair} teams={judgePair.teams} headerMap={this.state.headerMap} key={index} />
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

        if(this.state.isLoading){
            return (
                <div>
                    <Heading subtitle size={4}>Generating...</Heading>
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
