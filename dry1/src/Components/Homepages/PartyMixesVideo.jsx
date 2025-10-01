const PartyMixesVideo = () => {
  return (
    <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] relative overflow-hidden bg-black">
      {/* Video element */}
      <video 
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src="/Dry--fruits.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default PartyMixesVideo;
