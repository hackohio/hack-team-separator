import React, { Component } from 'react';
import 'react-bulma-components/src/index.sass';
import Container from 'react-bulma-components/lib/components/container';
import Heading from 'react-bulma-components/lib/components/heading';
import Section from 'react-bulma-components/lib/components/section';
import Button from 'react-bulma-components/lib/components/button';
import { Field, Control, Label, Input, Help } from 'react-bulma-components/lib/components/form';
import Generator from './Generator';
import ReactFileReader from 'react-file-reader';
import csv from 'csvtojson';

class TeamSeparator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needsUpload: true,
            numJudges: '',
            statusColor: null,
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
        const numJudges = evt.target.value;
        let statusColor = null;
        if(numJudges){
            statusColor = !isNaN(numJudges) ? 'success' : 'danger';
        }
        if(statusColor !== this.state.statusColor)
            this.setState({
                statusColor: statusColor,
                numJudges: numJudges,
            });
        else
            this.setState({ 
                numJudges: numJudges,
            });
    }

    DynamicSection = () => {
        if(this.state.needsUpload) {
            return(
                <div name="UploadSection">
                    <Section>
                        <Container>
                            <Field>
                                <Label>Number of judge-pairs:</Label>
                                <Control>
                                    <Input color={this.state.statusColor} onChange={this.onChange} name="num_judges" type="text" placeholder="Number input" value={this.state.numJudges} />
                                </Control>
                                <Help disabled={this.state.statusColor!=='danger'} color="danger">This is not a valid numeric value.</Help>
                            </Field>
                            <Field>
                                <Label>Please select a CSV file containing student teams:</Label>
                                <Control> 
                                    <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
                                        <Button disabled={this.state.statusColor!=='success'}>Upload</Button>
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
                <Generator teams={this.state.teams} numJudges={this.state.numJudges} />
            </div>
        );
    }

    render() {

        return (
            <div>
                <Section>
                    <Container>
                        <Heading size={3}>Team Separator</Heading>
                        <Heading subtitle size={5}>Generate PDFs for judging pairs.</Heading>
                    </Container>
                </Section>
                {this.DynamicSection()}
            </div>
        );
    }
}

export default TeamSeparator;
