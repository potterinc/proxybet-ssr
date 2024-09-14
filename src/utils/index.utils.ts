import UserModel from "../models/user. model"

/**
 * Delete token after 15 minutes of inactivity
 * @param id User id
 */
const removeInactiveToken = (id: string) => {
  setTimeout(() => {
    UserModel.findByIdAndUpdate(id, {
      $unset: { token: '' }
    }).exec()
  }, 900000)
}

export { removeInactiveToken };