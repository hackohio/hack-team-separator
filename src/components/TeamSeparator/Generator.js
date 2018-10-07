import React, { Component } from 'react';
import 'react-bulma-components/src/index.sass';
import { Field, Control } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';
import Heading from 'react-bulma-components/lib/components/heading';
import { BlobProvider, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

class Generator extends Component {
    constructor(props) {
        super(props);
        const styles = StyleSheet.create({
            page: {
                flexDirection: 'row',
                backgroundColor: '#E4E4E4'
            },
            section: {
                margin: 10,
                padding: 10,
                flexGrow: 1
            }
        });
        const infoHeader = "Separated and generated for " + this.props.judgePairs.length + " judge-pairs:";
        this.state = {
            styles: styles,
            judgePairs: this.props.judgePairs,
            infoHeader: infoHeader,
        };
    }

    reloadPage = () => {
        window.location.reload();
    }

    render() {
        const GeneratedPDFs = (
            <Document>
                <Page size="A4" style={this.state.styles.page}>
                    <View style={this.state.styles.section}>
                        <Text>Section #1</Text>
                    </View>
                    <View style={this.state.styles.section}>
                        <Text>Section #2</Text>
                    </View>
                </Page>
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
                                        <a href={url}><Button>Download</Button></a>
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
