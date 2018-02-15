import Immutable from 'immutable'
import { makeActions } from './'
import { actions as identityActions } from './wallet/identity-new'
import router from './router'

export const actions = makeActions('verification', {
  startEmailVerification: {
    expectedParams: ['email', 'index', 'pin'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const { id, pin } = getState().toJS().wallet.identity
            .contact.emails[params.index]

        dispatch(actions.startEmailVerification.buildAction(params,
        (backend) => {
          return backend.verification.startVerifyingEmail({
            wallet: services.auth.currentUser.wallet,
            id: id,
            email: params.email,
            pin
          })
        }))
      }
    }
  },
  startPhoneVerification: {
    expectedParams: ['phone'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.startPhoneVerification.buildAction(params,
        (backend) => {
          const phoneData = getState().toJS().wallet.identityNew.userData.phone
            dispatch(identityActions.setSmsVerificationCodeStatus(
              {field: 'phone',
               value: true}
            ))
          let phoneDat = getState().toJS().wallet.identityNew.userData.phone
          return backend.verification.startVerifyingPhone({
            did: "dsgs",
            value: phone.value,
            pin: phoneData.pin
          })
        }))
      }
    }
  },
  confirmEmail: {
    expectedParams: ['email', 'id', 'code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        if (!params || !params.email || !params.id || !params.code) {
          let action = {
            type: actions.confirmEmail.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirmEmail.buildAction(params, (backend) => {
          return backend.verification.verifyEmail({
            wallet: services.auth.currentUser.wallet,
            id: params.id,
            email: params.email,
            code: params.code
          })
        }))
      }
    }
  },
  goToAfterConfirmEmail: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const user = services.auth.currentUser
        if (user == null || user.wallet.seedPhrase === undefined) {
          dispatch(router.pushRoute('/'))
        } else {
          dispatch(router.pushRoute('/wallet/identity'))
        }
      }
    }
  },
  confirmPhone: {
    expectedParams: ['index'],
    async: true,
    creator: (index) => {
      return (dispatch, getState, {services}) => {
        const { id, smsCode: code, number: phone, type } = getState()
          .toJS().wallet.identity.contact.phones[index]
        if ([index, phone, code].includes(undefined)) {
          let action = {
            type: actions.confirmPhone.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirmPhone.buildAction(index, (backend) => {
          return backend.verification.verifyPhone({
            wallet: services.auth.currentUser.wallet,
            id,
            type,
            phone,
            code
          })
        }))
      }
    }
  },
  resendVerificationLink: {
    expectedParams: ['email', 'code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {}
    }
  },
  resendVerificationCode: {
    expectedParams: ['phone', 'code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {}
    }
  }
})
const confirmSuccess = (state) => Immutable.fromJS(state).merge({
  success: true,
  loading: false
})
const confirmFail = (state) => Immutable.fromJS(state).merge({
  loading: false
})
const initialState = Immutable.fromJS({
  success: false,
  loading: true
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.confirmEmail.id_success:
      return confirmSuccess(state)

    case actions.confirmEmail.id_fail:
      return confirmFail(state)

    default:
      return state
  }
}
