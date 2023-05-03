export type UserConservation = {
  ['user_id']: string
  ['user_email']: string
  ['user_full_name']: string
  ['user_avatar_url']: string | null
  ['user_is_verified']: boolean
  ['user_is_active']: boolean
  ['user_created_at']: Date
  ['user_updated_at']: Date
  ['user_deleted_at']: Date | null

  ['participants_id']: string
  ['participants_conservation_id']: string
  ['participants_user_id']: string
  ['participants_created_at']: Date
  ['participants_updated_at']: Date
  ['participants_deleted_at']: Date | null

  ['conservation_id']: string
  ['conservation_creator_id']: string
  ['conservation_type']: string
  ['conservation_created_at']: Date
  ['conservation_updated_at']: Date
  ['conservation_deleted_at']: Date | null

  ['message_id']: string
  ['message_message']: string
  ['message_message_type']: string
  ['message_is_removed']: boolean
  ['message_sender_id']: string
  ['message_conservation_id']: string
  ['message_created_at']: Date
  ['message_updated_at']: Date
  ['message_deleted_at']: Date | null

  ['participant_id']: string
  ['participant_conservation_id']: string
  ['participant_user_id']: string
  ['participant_created_at']: Date
  ['participant_updated_at']: Date
  ['participant_deleted_at']: Date | null

  ['partner_id']: string
  ['partner_email']: string
  ['partner_full_name']: string
  ['partner_avatar_url']: string | null
  ['partner_is_verified']: boolean
  ['partner_is_active']: true
  ['partner_created_at']: Date
  ['partner_updated_at']: Date
  ['partner_deleted_at']: Date | null

  ['conservationSettings_id']: string
  ['conservationSettings_is_muted']: boolean
  ['conservationSettings_is_removed']: boolean
  ['conservationSettings_is_archived']: boolean
  ['conservationSettings_auto_remove_after']: number
  ['conservationSettings_user_id']: string
  ['conservationSettings_conservation_id']: string
  ['conservationSettings_created_at']: Date
  ['conservationSettings_updated_at']: Date
  ['conservationSettings_deleted_at']: Date | null
}
