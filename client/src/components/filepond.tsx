import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import axios from 'axios'

import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'

import { IFile } from '../lib/interfaces'

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
)


export const Filepond: React.FC = () => {
  const [imgCollection, setImgCollection] = useState<IFile>([])
  const [uploadFile, setFile] = useState<string>('')

  const onFileChange = (files: []) => {
    const items = files.map((fileItem: IFile) => fileItem.file)
    setImgCollection([...imgCollection, items])
  }

  const onSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    const formData = new FormData()
    for (const img in imgCollection[0]) {
      formData.append('imgCollection', imgCollection[0][img])
    }
    axios.post(`http://localhost:3001/create`, formData, {}).then((res) => {
      console.log('image Created', res.data)
      setImgCollection([])
      setFile(res.data)
    })
  }

  return (
    <UploadFile>
      <FilepondStyle>
        <FilePond
          files={imgCollection}
          allowMultiple={true}
          server={null}
          onupdatefiles={(fileItems: any) => onFileChange(fileItems)}
          acceptedFileTypes={['image/*']}
          instantUpload={false}
          maxFileSize="1MB"
          labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
        />
      </FilepondStyle>
      <Button onClick={onSubmit}>Submit</Button>
      <Upload>{uploadFile}</Upload>
    </UploadFile>
  )
}

const UploadFile = styled.div`
  width: 100%;
  height: 100vh;
  background: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const FilepondStyle = styled.div`
  width: 35%;
  @media (max-width: 768px) {
    width: 85%;
  }
`

const Button = styled.button`
  font-size: 1.5em;
  background: transparent;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
`

const Upload = styled.p`
  font-size: 1em;
  color: #5c5ca9;
`

export default Filepond
