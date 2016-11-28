class EmailsController < ApplicationController
  def index
    emails_data
  end

  private

  def emails_data
    @emails = Email.includes(:template).order('emails.updated_at DESC').map do |email|
      {
        id: email.id,
        name: email.name,
        template_name: email.template.try(:name),
        created_at: email.created_at.strftime('%m/%d/%Y'),
        updated_at: email.updated_at.strftime('%m/%d/%Y')
      }
    end
  end
end
