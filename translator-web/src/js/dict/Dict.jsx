import React, {Component} from "react";

import Col, {Button, ButtonGroup, Container, Form} from "react-bootstrap"
import {connect} from "react-redux";

import WordsGrid from "../grid/WordsGrid";
import {wordsActions} from "../words/WordsReducer";
import {langsActions} from "../langs/LangsReducer";

class Dict extends Component {
    constructor(props) {
        super(props);
        this.state = {
            word: "",
            langCode: ""
        }
        this.onWordsList = props.onWordsList.bind(this);
        this.onLangsList = props.onLangsList.bind(this);
        this.onSelectLang = this.onSelectLang.bind(this);
        this.onContentChange = this.onContentChange.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
    }

    componentDidMount() {
        this.onWordsList();
        this.onLangsList();
    }

    onSelectLang(lang) {
        this.setState({lang})
        this.onWordsList(this.state.word, lang.code);
    }

    onContentChange(content) {
        const word = content.target.value;
        this.setState({word});
        this.onWordsList(word, this.state.langCode);
    }

    onSearchClick(event) {
        this.onWordsList(this.state.word, this.state.langCode);
    }

    render() {
        let langs = this.props?.langs;
        if (!langs) {
            langs = [];
        }
        let lang1 = this.state.lang;
        return (<React.Fragment>
                <h5>Words...</h5>
                <Container fluid={"md"}>
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Content</Form.Label>
                                <Form.Control type="text" placeholder="Enter word" value={this.state.word}
                                              onChange={this.onContentChange}/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Language</Form.Label>
                                {/*<Form.Control as="select" title={lang1 ? lang1.name : "Language"}>{*/}
                                {/*    langs.map((lang, index) => {*/}
                                {/*        return (<option*/}
                                {/*            key={"lang-" + lang.code}*/}
                                {/*            onClick={(e) => this.onSelectLang(lang)}*/}
                                {/*            active={lang1?.code == lang.code ? "active" : ""}*/}
                                {/*        >{lang.name}</option>)*/}
                                {/*    })}*/}
                                {/*</Form.Control>*/}
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Actions</Form.Label><br/>
                                <ButtonGroup>
                                    <Button variant="primary" type="button" onClick={this.onSearchClick}>Find</Button>
                                    <Button variant="secondary">Add New</Button>
                                </ButtonGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group>
                                Search for: {this.state.word} ({this.state.lang?.name})
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Container>
                <WordsGrid
                    columns={[
                        {title: "ID", field: "id"},
                        {title: "Content", field: "content"},
                        {title: "Language", field: "langName"},
                        {title: "Tags", field: "tags"}
                    ]}
                    rows={this.props.words}
                    pageSize={this.props.pageSize}
                    totalPages={this.props.totalPages}
                    currentPage={this.props.currentPage}
                    pageClicked={(page, pageSize) => {
                        console.log(`${page} + ${pageSize}`);
                        this.props.onWordsList(this.state.word, this.state.langCode, page, pageSize)
                    }}
                />
            </React.Fragment>
        )
    }
}

export const WordsConnected = connect((state, props) => {
    let wordsReducer = state.wordsReducer;
    let langsReducer = state.langsReducer;
    return {
        words: wordsReducer.pager?.content,
        pageSize: wordsReducer.pager?.size,
        currentPage: wordsReducer.pager?.number,
        totalPages: wordsReducer.pager?.totalPages,
        word: wordsReducer.word,
        langs: langsReducer.pager?.content,
    }
}, (dispatch) => {
    return {
        onWordsList: (word, langCode, page = 0, pageSize = 2) => {
            wordsActions.list(word, langCode, page, pageSize)(dispatch);
        },
        onWordAdd: (word) => {
            dispatch(wordsActions.add(word));
        },
        onWordUpdate: (id, word) => {
            dispatch(wordsActions.update(id, word));
        },
        onLangsList: (content) => {
            langsActions.list()(dispatch);
        },
    }
})(Dict);
