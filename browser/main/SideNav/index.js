import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './SideNav.styl'
import { openModal } from 'browser/main/lib/modal'
import PreferencesModal from '../modals/PreferencesModal'
import ConfigManager from 'browser/main/lib/ConfigManager'
import StorageItem from './StorageItem'

const electron = require('electron')
const { remote } = electron

class SideNav extends React.Component {
  // TODO: should not use electron stuff v0.7
  handleMenuButtonClick (e) {
    openModal(PreferencesModal)
  }

  handleHomeButtonClick (e) {
    let { router } = this.context
    router.push('/home')
  }

  handleStarredButtonClick (e) {
    let { router } = this.context
    router.push('/starred')
  }

  handleToggleButtonClick (e) {
    let { dispatch, config } = this.props

    ConfigManager.set({isSideNavFolded: !config.isSideNavFolded})
    dispatch({
      type: 'SET_IS_SIDENAV_FOLDED',
      isFolded: !config.isSideNavFolded
    })
  }

  render () {
    let { storages, location, config } = this.props

    let isFolded = config.isSideNavFolded
    let isHomeActive = location.pathname.match(/^\/home$/)
    let isStarredActive = location.pathname.match(/^\/starred$/)
    let storageList = storages.map((storage) => {
      return <StorageItem
        key={storage.key}
        storage={storage}
        location={location}
        isFolded={isFolded}
      />
    })

    return (
      <div className='SideNav'
        styleName={isFolded ? 'root--folded' : 'root'}
        tabIndex='1'
      >
        <div styleName='top'>
          <button styleName='top-menu'
            onClick={(e) => this.handleMenuButtonClick(e)}
          >
            <i className='fa fa-navicon fa-fw'/>
            <span styleName='top-menu-label'>Menu</span>
          </button>
        </div>

        <div styleName='menu'>
          <button styleName={isHomeActive ? 'menu-button--active' : 'menu-button'}
            onClick={(e) => this.handleHomeButtonClick(e)}
          >
            <i className='fa fa-home fa-fw'/>
            <span styleName='menu-button-label'>Home</span>
          </button>
          <button styleName={isStarredActive ? 'menu-button--active' : 'menu-button'}
            onClick={(e) => this.handleStarredButtonClick(e)}
          >
            <i className='fa fa-star fa-fw'/>
            <span styleName='menu-button-label'>Starred</span>
          </button>
        </div>

        <div styleName='storageList'>
          {storageList.length > 0 ? storageList : (
            <div styleName='storageList-empty'>No storage mount.</div>
          )}
        </div>
        <button styleName='navToggle'
          onClick={(e) => this.handleToggleButtonClick(e)}
        >
          {isFolded
            ? <i className='fa fa-angle-double-right'/>
            : <i className='fa fa-angle-double-left'/>
          }
        </button>
      </div>
    )
  }
}

SideNav.contextTypes = {
  router: PropTypes.shape({})
}

SideNav.propTypes = {
  dispatch: PropTypes.func,
  storages: PropTypes.array,
  config: PropTypes.shape({
    isSideNavFolded: PropTypes.bool
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
}

export default CSSModules(SideNav, styles)
