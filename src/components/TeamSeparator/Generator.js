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
                flexDirection: 'row',
                backgroundColor: '#ffffff'
            },
            headerContainer: {
                borderBottomWidth: 1,
                borderBottomColor: '#bb0000',
                borderBottomStyle: 'solid',
                alignItems: 'stretch',
            },
            header: {
                margin: 10,
                padding: 10,
                flexGrow: 3,
            },
            headerText: {
                marginTop: 20,
            },
            logoSection: {
                margin: 10,
                padding: 10,
                flexGrow: 1,
            },
            logo: {
                width: '30%',
                padding: 10,
                alignSelf: 'flex-start',
                justifySelf: 'flex-start',
            }
        });

        //Header mapping (can be implemented dynamically)
        const headerMap = {
            "team_name": "Team Name",
            "member_names": "Member Names",
            "member_emails": "Member Emails",
            "proj_goal": "Project Goal",
            "proj_func": "Functionality",
        };
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
                <View style={this.state.styles.headerContainer}>
                    <View style={this.state.styles.logoSection}>
                        <Image
                            style={this.state.styles.logo}
                            src={hacklogo}
                        />
                        {props.teams.map(function(team, index){
                            return <Text>{team["Team Name"]}</Text>;
                        })}
                    </View>
                </View>
                <View style={this.state.styles.header}>
                     <Text style={this.state.styles.headerText}>HackOhio {(new Date().getFullYear())}</Text> 
                </View>
            </Page>
        );

        const GeneratedPDFs = (
            <Document>
                {this.state.judgePairs.map(function(judgePair, index){
                    return <JudgePage teams={judgePair.teams} />
                })}
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
