class TemplatesController < ApplicationController
  def new
  end

  def create
    begin
      template_data = params.permit(:name, :html)
      Template.create!(template_data)
      render json: { message: 'New template successfully'}, status: 200
    rescue => e
      render json: { message: e.message }, status: 400
    end
  end

  def edit
  end
end
