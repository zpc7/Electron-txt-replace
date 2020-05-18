import React from 'react';
import styles from './Home.css';
import { Upload, Button, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const fs = require('fs')

export default class Home extends React.Component {
  state = { fileList: [] }

  handleTransform = () => {
    const { fileList } = this.state;

    fileList.forEach((file: any) => {
      fs.readFile(file.path, 'utf-8', function (readError: any, files: any) {

        const result = files.replace(/;/g, ',');

        fs.writeFile(file.path, result, 'utf8', function (err: any) {
          if (err) {
            message.error('替换出错')
            console.log(err)
            return
          }
          message.success(`文件:${file.path} 替换成功!`)
        });

      })
    }
    )
  }
  render() {
    const { fileList } = this.state
    const props = {
      directory: true,
      multiple: true,
      onRemove: (file: any) => {
        this.setState((state: any) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file: any) => {
        console.log('type:', file.type)
        if (file.type === 'text/plain') {
          this.setState((state: any) => ({
            fileList: [...state.fileList, file],
          }));
        }
        return false;
      },
      fileList
    };
    return (
      <div className={styles.container} data-tid="container">
        <Upload {...props}>
          <Button type="primary" size='large' style={{ marginTop: 30 }}>
            <InboxOutlined />选择文件夹</Button>
        </Upload>
        <Button
          danger
          type="primary"
          size='large'
          onClick={this.handleTransform}
          disabled={fileList.length === 0}
          style={{ marginTop: 60, marginBottom: 30, borderRadius: 15 }}
        >
          开始替换
        </Button>
      </div>
    );
  }
}
