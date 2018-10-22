import React, { Component } from 'react';
import 'react-bulma-components/src/index.sass';
import { Field, Control } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';
import Heading from 'react-bulma-components/lib/components/heading';
import { BlobProvider, Document, Page, Text, Image, View, StyleSheet } from '@react-pdf/renderer';
import hacklogo from '../../img/hackohiologo.png';

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
            },
            logo: {
                width: '20%',
                padding: 10,
                alignSelf: 'flex-start',
                justifySelf: 'flex-start',
            },
            teamContainer: {
                padding: 10,
                flexGrow: 3,
            },
            teamTitle: {
                fontSize: 20,
            },
            teamInfo: {
                fontSize: 10,
            },
            teamView: {
                padding: 20,
            },
        });

        //Header mapping (can be implemented dynamically)
        const headerMap = {
            "team_name": "Team Name",
            "member_names": "Member Names",
            "member_emails": "Member Emails",
            "proj_name": "Project Goal",
            "proj_desc": "Functionality",
            "team_loc": "Location",
        };
        

        //Real HEADERMAP
        /*const headerMap = {
            "team_name": "Q3",
            "member_names": "Q4",
            "member_emails": "Q19",
            "proj_name": "Q31",
            "proj_desc": "Q13",
            "team_loc": "Q8",
            "team_pos": "Q29",
        };
        */
        const infoHeader = "Separated and generated for " + this.props.judgePairs.length + " judge-pairs:";

        this.state = {
            styles: styles,
            judgePairs: this.props.judgePairs,
            infoHeader: infoHeader,
            headerMap: headerMap,
        };
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
                        return (
                            <View style={this.state.styles.teamView}>
                                <Text style={this.state.styles.teamName}>{team[props.headerMap.team_name]}</Text>
                                <Text style={this.state.styles.teamInfo}>Members: {team[props.headerMap.member_names]}</Text>
                                <Text style={this.state.styles.teamInfo}>Emails: {team[props.headerMap.member_emails]}</Text>
                                <Text style={this.state.styles.teamInfo}>Project Name: {team[props.headerMap.proj_name]}</Text>
                                <Text style={this.state.styles.teamInfo}>Project Desc: {team[props.headerMap.proj_desc]}</Text>
                                <Text style={this.state.styles.teamInfo}>Location: {team[props.headerMap.team_loc]}</Text>
                            </View>
                        );
                    }.bind(this))}
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
                            <Heading subtitle size={4}>Generating...</Heading> 
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

        return (
            <div>
                <DownloadContainer />
            </div>
        );
    }

}
export default Generator;
