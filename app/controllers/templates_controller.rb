class TemplatesController < ApplicationController
  def index
    templates_data
  end

  def new
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
  end

  def destroy
    begin
      Template.find(params[:id]).destroy
      render json: { message: 'Delete template successfully', templates_data: templates_data }, status: 200
    rescue Exception => e
      render_error(e)
    end
  end

  private

  def templates_data
    @templates = Template.all.map do |template|
      {
        id: template.id,
        name: template.name,
        created_at: template.created_at.strftime('%m/%d/%Y'),
        updated_at: template.updated_at.strftime('%m/%d/%Y')
      }
    end
  end

  def render_error e
    render json: { message: e.message }, status: 400
  end
end
