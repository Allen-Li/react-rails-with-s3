class TemplatesController < ApplicationController
  def index
    templates_data
  end

  def new
  end

  def update
    begin
      updated_params = params.permit(:name, :html)
      Template.find(params[:id]).update_attributes(updated_params)
      redirect_to templates_path
    rescue Exception => e
      render_error(e)
    end
  end

  def create
    begin
      template_data = params.permit(:name, :html)
      Template.create!(template_data)
      render json: { message: 'New template successfully'}, status: 200
    rescue => e
      render_error(e)
    end
  end

  def edit
    @template = Template.find(params[:id])
  end

  def destroy
    begin
      Template.find(params[:id]).destroy
      render json: { message: 'Delete template successfully', templates_data: templates_data }, status: 200
    rescue Exception => e
      render_error(e)
    end
  end

  def download
    template = Template.find(params[:id])
    send_data template.html, filename: "#{template.name}.html"
  end

  def preview
    template = Template.find(params[:id])
    render html: template.html.html_safe
  end

  def upload
    begin
      new_data = []
      params.map do |k, v|
        if v.class == ActionDispatch::Http::UploadedFile
          html = File.read(v.tempfile)
          new_data << {name: v.original_filename, html: html}
        end
      end

      new_templates = Template.create!(new_data)
      render json: { message: 'Uploaded templates successfully', new_templates: new_templates }, status: 200
    rescue Exception => e
      render_error(e)
    end
  end

  private

  def templates_data
    @templates = Template.order('updated_at DESC').map do |template|
      {
        id: template.id,
        name: template.name,
        created_at: template.created_at.strftime('%m/%d/%Y'),
        updated_at: template.updated_at.strftime('%m/%d/%Y')
      }
    end
  end
end
