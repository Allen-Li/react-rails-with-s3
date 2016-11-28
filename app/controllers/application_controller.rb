class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  private

  def render_error e
    render json: { message: e.message }, status: 400
  end
end
