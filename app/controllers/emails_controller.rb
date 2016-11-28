class EmailsController < ApplicationController
  def index
    emails_data
  end

  def destroy
    begin
      Email.find(params[:id]).destroy
      render json: { message: 'Delete email successfully', emails_data: emails_data }, status: 200
    rescue Exception => e
      render_error(e)
    end
  end

  def download
    email = Email.find(params[:email_id])
    send_data email.nde, filename: "#{email.name}.html"
  end

  def preview
    email = Email.find(params[:email_id])
    render html: email.nde.html_safe
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
