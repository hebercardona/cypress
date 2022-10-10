const axios = require('axios').default;
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const moment = require('moment');

class TestRailApi {
    constructor(options) {
        this.http = axios.create({
            baseURL: `https://${options.host}.testrail.io/index.php?/api/v2`,
            auth: {
                username: options.username,
                password: options.password,
            },
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async createRun(projectId, detail) {
        try {
            const res = await this.http.post(`/add_run/${projectId}`, detail);
            return res.data;
        } catch (err) {
            console.log(err.reponse);
        }
    }

    async updateRun(runId, testCases) {
        try {
            const res = await this.http.post(`/update_run/${runId}`, {
                case_ids: testCases.map((item) => item.case_id),
            });
            return res.data;
        } catch (err) {
            console.log(err.reponse);
        }
    }

    async addResultsForCases(runId, testResults) {
        const res = await this.http.post(`/add_results_for_cases/${runId}`, {
            results: testResults,
        });
        return res.data;
    }

    uploadVideo(runId, filePath, videoName) {
        filePath = filePath.replace('cypress/integration/', '');
        const VIDEO_PATH = path.join(__dirname, `../videos/${filePath}.mp4`);
        const attachment = fs.readFileSync(VIDEO_PATH);

        const form = new FormData();
        form.append('attachment', attachment, `${videoName}.mp4`);

        this.http
            .post(`/add_attachment_to_run/${runId}`, form, {
                headers: {
                    ...form.getHeaders(),
                },
            })
            .then((res) => console.log(res.data))
            .catch((err) => {
                console.log(err.response);
            });
    }

    uploadScreenshots(title, parent_title, resultId) {
        const SCREENSHOTS_FOLDER_PATH = path.join(__dirname, '../screenshots');

        const files = this.getAllFiles(SCREENSHOTS_FOLDER_PATH);

        const file = files.find((item) => item.includes(title));
        if (file) {
            const attachment = fs.readFileSync(file);
            const form = new FormData();
            form.append(
                'attachment',
                attachment,
                `${parent_title} -- ${title} (failed).png`
            );
            this.http
                .post(`/add_attachment_to_result/${resultId}`, form, {
                    headers: {
                        ...form.getHeaders(),
                    },
                })
                .then((res) => console.log(res.data))
                .catch((err) => {
                    console.log(err.response);
                });
        }
    }

    getAllFiles(dirPath, arrayOfFiles) {
        var self = this;
        const files = fs.readdirSync(dirPath);

        arrayOfFiles = arrayOfFiles || [];

        files.forEach(function (file) {
            if (fs.statSync(dirPath + '/' + file).isDirectory()) {
                arrayOfFiles = self.getAllFiles(
                    dirPath + '/' + file,
                    arrayOfFiles
                );
            } else {
                arrayOfFiles.push(path.join(dirPath, '/', file));
            }
        });

        return arrayOfFiles;
    }
}

module.exports = TestRailApi;
