require 'rails_helper'

RSpec.describe Email, type: :model do
  describe '#tracking_pixels_el' do
    before do
      FactoryGirl.create(:email)
    end

    let(:tp_el) {
      "<a><img src=\"https://test_pixel1\" width=\"1\" height=\"1\" border=\"0\" style=\"display:none;\"></a> " \
      "<a><img src=\"https://test_pixel2\" width=\"1\" height=\"1\" border=\"0\" style=\"display:none;\"></a>"
    }

    it 'return right data' do
      expect(Email.first.send(:tracking_pixels_el)).to eq(tp_el)
    end
  end
end
