import React, {useCallback, useState} from 'react'
import {useDropzone} from "react-dropzone"
import "./styles.css"

interface Props {
  onSelectedFile: (file: File) => void
}

const Dropzone: React.FC<Props> = ({onSelectedFile}) => {
  const [ selectedFileUrl, setSelectedFileUrl ] = useState<string>("")

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]

    const fileUrl = URL.createObjectURL(file)

    setSelectedFileUrl(fileUrl)
    onSelectedFile(file)
  }, [])
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: "image/*"
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {selectedFileUrl? <img src={selectedFileUrl} alt="Point Thumbnail" />:
      (
        <p>Selecione uma imagem do estabelecimento</p>
      )
      }
    </div>
  )
}

export default Dropzone
