import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/identity', {
  goToContactManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/identity/contact'))
      }
    }
  },
  goToPassportManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/identity/passport/add'))
      }
    }
  },
  goToDrivingLicenceManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/identity/drivers-licence/add'))
      }
    }
  },
  goToIdentity: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/identity/'))
      }
    }
  },
  getIdentityInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.getIdentityInformation.buildAction(params,
        () => {
          return services.auth.currentUser.wallet.getUserInformation({
            email: 'test@test.com'
          })
        }))
      }
    }
  }
})

const mapBackendToState = (data) => Immutable.fromJS(data).merge({loaded: true, error: false})
const mapBackendToStateError = (data) =>
  Immutable.fromJS(data).merge({loaded: true, error: true})
const initialState = Immutable.fromJS({
  loaded: false,
  error: false,
  webId: '',
  username: {
    verified: false,
    value: ''
  },
  contact: {
    phone: [{
      type: '',
      number: '',
      verified: false
    }],
    email: [{
      type: '',
      address: '',
      verified: false
    }]
  },
  passport: {
    number: '',
    givenName: '',
    familyName: '',
    birthDate: '',
    gender: '',
    showAddress: '',
    streetAndNumber: '',
    city: '',
    zip: '',
    state: '',
    country: '',
    verified: false
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.getIdentityInformation.id_success:
      return mapBackendToState(action.result)
    case actions.getIdentityInformation.id_fail:
      return mapBackendToStateError(state)
    default:
      return state
  }
}
