import PropTypes from 'prop-types'

function UploadProgress({ progress }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-mozi-black font-medium">Progression</span>
        <span className="text-sm text-mozi-black font-medium">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-mozi-active h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

UploadProgress.propTypes = {
  progress: PropTypes.number.isRequired
}

export default UploadProgress
