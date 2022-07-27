import React from 'react'

const audioContext = React.createContext()
export default audioContext

export const AudioProvider = ({ children }) => {
  const [urls, setUrls] = React.useState([
        // 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3',
        // 'http://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg',
        // 'http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg',
    ])

  return (
    <audioContext.Provider value={[urls, setUrls]}>
      {children}
    </audioContext.Provider>
  )
}