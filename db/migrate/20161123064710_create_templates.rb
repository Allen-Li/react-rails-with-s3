class CreateTemplates < ActiveRecord::Migration[5.0]
  def change
    create_table :templates do |t|
      t.string :name, null: false
      t.string :created_by
      t.string :updated_by
      t.string :width
      t.text :html

      t.timestamps
    end

    add_index :templates, :name, unique: true
  end
end