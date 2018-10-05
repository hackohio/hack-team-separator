import React, { Component } from 'react';
import 'react-bulma-components/src/index.sass';
import Container from 'react-bulma-components/lib/components/container';
import Heading from 'react-bulma-components/lib/components/heading';
import Section from 'react-bulma-components/lib/components/section';
import Button from 'react-bulma-components/lib/components/button';
import { Field, Control, Label, Input } from 'react-bulma-components/lib/components/form';
import Generator from './Generator';
import ReactFileReader from 'react-file-reader';
import csv from 'csvtojson';

class TeamSeparator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needsUpload: true,
            numJudges: null,
        };
    }

    handleFiles = (files) => {
        let reader = new FileReader();
        reader.onload = function(e) {
            csv()
            .fromString(reader.result)
            .then((jsonObject) => {
                this.saveData(jsonObject);
            });
        }.bind(this);
        reader.readAsText(files[0]);
    }

    saveData = (jsonObject) => {
        this.setState({
            needsUpload: false,
            teams: jsonObject,
        });
    }

    onChange = (evt) => {
        const value = evt.target.value;
        this.setState({
            numJudges: value,
        });
    }

    render() {
        const DynamicSection = () => {
            if(this.state.needsUpload) {
                let statusColor = '';
                if(this.state.numJudges)
                    statusColor = !isNaN(this.state.numJudges) ? 'success' : 'danger';
                
                return(
                    <div name="UploadSection">
                        <Section>
                            <Container>
                                <Field>
                                    <Label>Number of judge-pairs:</Label>
                                    <Control>
                                        <Input color={statusColor} onChange={this.onChange} name="num_judges" type="text" placeholder="Number of judge-pairs" value={this.state.numJudges} />
                                    </Control>
                                </Field>
                                <Field>
                                    <Label>Please select a CSV file containing student teams:</Label>
                                    <Control> 
                                        <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
                                            <Button disabled={!statusColor}>Upload</Button>
                                        </ReactFileReader>
                                    </Control>
                                </Field>
                            </Container>
                        </Section>
                    </div>
                );
            }
            return(
                <div name="GeneratorSection">
                    <Generator teams={this.state.teams} />
                </div>
            );
        }

        return (
            <div>
                <Section>
                    <Container>
                        <Heading size={3}>Team Separator</Heading>
                        <Heading subtitle size={5}>Generate PDFs for judging pairs.</Heading>
                    </Container>
                </Section>
                <DynamicSection />
            </div>
        );
    }
}

export default TeamSeparator;
