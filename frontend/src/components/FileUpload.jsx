import React from 'react' // Import React library
import Dropzone from 'react-dropzone' // Library for drag-and-drop file uploads
import axiosInstance from '../utils/axios' // Import Axios instance for API requests
import './../Common.css' // Import common CSS file

// FileUpload component: Provides image upload and delete functionality
const FileUpload = ({ onImageChange, images }) => {

  // Handler called when files are dropped
  const handleDrop = async (files) => {
    let formData = new FormData(); // Create FormData object for file data transmission

    const config = {
      header: { 'content-type': 'multipart/form-data' } // Configuration for file upload with the server
    }

    formData.append('file', files[0]); // Add the first dropped file to FormData

    try {
      // Send file upload request to the server
      const response = await axiosInstance.post('/products/image', formData, config)
      
      // Pass the uploaded image file name to the parent component
      onImageChange([...images, response.data.fileName])

    } catch (error) {
      console.error(error) // Log the error in case of upload failure
    }
  }

  // Handler called when the delete button for an image is clicked
  const handleDelete = (image) => {
    const currentIndex = images.indexOf(image); // Find the index of the image to be deleted
    let newImages = [...images]; // Copy the existing image array
    newImages.splice(currentIndex, 1); // Remove the image at the specified index from the array
    onImageChange(newImages); // Pass the updated image array to the parent component
  }

  return (
    <div> {/* Container for image upload and preview */}
      
      {/* File upload Dropzone */}
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <section
            className='dropzone' {...getRootProps()}
          > {/* Drag-and-drop section */}
              <input {...getInputProps()} /> {/* Hidden file input field */}
              <p className='text-3xl'>DRAG & DROP</p> {/* Display 'DRAG & DROP' text */}
          </section>
        )}
      </Dropzone>

      {/* Preview of uploaded images */}
      <div className='imageZone'>
        {images.map(image => ( /* Iterate over uploaded images to render them */
          <div key={image} onClick={() => handleDelete(image)}> {/* Delete image on click */}
            <img
              className='imageView' /* Style for image */
              src={`${import.meta.env.VITE_SERVER_URL}/${image}`} /* Image URL from the server */
              alt={image} /* Alternative text for the image */
            />
          </div>
        ))}
      </div>

    </div>
  )
}

export default FileUpload; // Export FileUpload component
