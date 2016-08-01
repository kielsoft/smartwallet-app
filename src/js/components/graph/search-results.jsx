import React from 'react'
import Radium from 'radium'

import {
  List,
  ListItem
} from 'material-ui'

class SearchResults extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object
  }

  state = {
    results: [{
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }, {
      title: 'Eelco Wiersma'
    }]
  }

  getStyles() {
    let styles = {
      container: {

      }
    }

    return styles
  }

  render() {
    const {style} = this.props
    const styles = this.getStyles()
    const results = this.state.results

    return (
      <div style={[styles.container, style]}>
        <List>
          {results.map((result, i) => {
            return <ListItem key={i} primaryText={result.title} />
          })}
        </List>
      </div>
    )
  }

}

export default Radium(SearchResults)
