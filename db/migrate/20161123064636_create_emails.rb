class CreateEmails < ActiveRecord::Migration[5.0]
  def change
    create_table :emails do |t|
      t.string :name, null: false
      t.string :path
      t.string :created_by
      t.string :updated_by
      t.string :email_type
      t.text :html
      t.text :tracking_pixels
      t.text :moat_tags
      t.text :nde
      t.integer :template_id

      t.timestamps
    end

    add_index :emails, :name, unique: true
  end
end