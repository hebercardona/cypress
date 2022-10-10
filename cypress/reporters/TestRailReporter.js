const Mocha = require('mocha');
const moment = require('moment');
const TestRailApi = require('./TestRailApi');

const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END,
    STATE_STOPPED,
} = Mocha.Runner.constants;

// this reporter outputs test results, indenting two spaces per suite
class TestRailReporter extends Mocha.reporters.Spec {
    constructor(runner, options) {
        super(runner);
        this._indents = 0;
        const stats = runner.stats;
        this._testCases = [];
        this.options = options.reporterOptions;
        this.runId = 0;
        this.testRailApi = new TestRailApi(this.options);
        runner
            .once(EVENT_RUN_BEGIN, async () => {
                const executionDateTime = moment().format(
                    'MMM Do YYYY, HH:mm (Z)'
                );
                const newRun = {
                    name: `Automated test run: ${process.env.BRANCH_NAME} ${executionDateTime}`,
                    include_all: false,
                    suite_id: 1,
                };

                const testRun = await this.testRailApi.createRun(
                    this.options.projectId,
                    newRun
                );
                this.runId = testRun.id;
            })
            .on(EVENT_SUITE_BEGIN, () => {
                this.increaseIndent();
            })
            .on(EVENT_SUITE_END, () => {
                console.log('EVENT_SUITE_END');

                this.decreaseIndent();
            })
            .on(EVENT_TEST_PASS, (test) => {
                this.addTestCases(
                    test,
                    true,
                    `Execution time: ${test.duration}ms`
                );
            })
            .on(EVENT_TEST_FAIL, (test, err) => {
                this.addTestCases(test, false, `${err.message}`);
            })
            .once(EVENT_RUN_END, () => {
                console.log(
                    `end: ${stats.passes}/${stats.passes + stats.failures} ok`
                );
                this.testRailApi.uploadVideo(this.runId, runner.suite.file, process.env.BRANCH_NAME);
            });

    }

    async addTestCases(test, isSucess, comment) {
        const caseIds = this.titleToCaseIds(test.title);
        if (caseIds.length > 0) {
            caseIds.forEach((caseId) => {
                this._testCases.push({
                    case_id: caseId,
                    status_id: isSucess ? 1 : 5,
                    title: test.title,
                    parent_title: test.parent.title,
                });
            });
    
            await this.testRailApi.updateRun(this.runId, this._testCases);
    
            const caseResults = caseIds.map((caseId) => {
                return {
                    case_id: caseId,
                    status_id: isSucess ? 1 : 5,
                    comment: comment,
                };
            });
            const publishedResults = await this.testRailApi.addResultsForCases(this.runId, caseResults);
            if (!isSucess && publishedResults.length > 0) {
                publishedResults.forEach((result) => {
                    this.testRailApi.uploadScreenshots(
                        test.title,
                        test.parent.title,
                        result.id
                    );
                });
            }
        }
        
    }

    indent() {
        return Array(this._indents).join('  ');
    }

    increaseIndent() {
        this._indents++;
    }

    decreaseIndent() {
        this._indents--;
    }

    titleToCaseIds(title) {
        let caseIds = [];

        let testCaseIdRegExp = /\bT?C(\d+)\b/g;
        let m;
        while ((m = testCaseIdRegExp.exec(title)) !== null) {
            let caseId = parseInt(m[1]);
            caseIds.push(caseId);
        }
        return caseIds;
    }
}

module.exports = TestRailReporter;
