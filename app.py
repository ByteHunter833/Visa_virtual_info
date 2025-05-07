from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///countries.db'
db = SQLAlchemy(app)


class Country(db.Model):
    country_code = db.Column(db.String(10), primary_key=True)
    name_uz = db.Column(db.String(100), unique=True, nullable=False)
    name_ru = db.Column(db.String(100), unique=True, nullable=False)
    name_en = db.Column(db.String(100), unique=True, nullable=False)

    post = db.relationship('Post_info', backref='country', uselist=False)

class Post_info(db.Model):
    post_id = db.Column(db.Integer, primary_key=True)
    country_code = db.Column(db.String(10), db.ForeignKey('country.country_code'), unique=True, nullable=False)
    post_uz = db.Column(db.Text, nullable=False)
    post_ru = db.Column(db.Text, nullable=False)
    post_en = db.Column(db.Text, nullable=False)
    
@app.route('/')
def index():
    return "Visa Countries API ishlayapti!"


@app.route('/api/countries', methods=['GET'])
def get_countries():
    countries = Country.query.all()
    result = []
    for country in countries:
        result.append({
            'country_code': country.country_code,
            'name_uz': country.name_uz,
            'name_ru': country.name_ru,
            'name_en': country.name_en
        })
    return jsonify(result)

@app.route('/api/countries/<country_code>', methods=['GET'])
def get_country_info(country_code):
    country = Country.query.filter_by(country_code=country_code).first()
    if country:
        return jsonify({
            'country_code': country.country_code,
            'name_uz': country.name_uz,
            'name_ru': country.name_ru,
            'name_en': country.name_en,
            'post_uz': country.post.post_uz,
            'post_ru': country.post.post_ru,
            'post_en': country.post.post_en
        })
    return jsonify({'error': 'Country not found'}), 404

@app.route('/api/countries', methods=['POST'])
def add_country():
    data = request.get_json()

    country = Country(
        country_code=data['country_code'],
        name_uz=data['name_uz'],
        name_ru=data['name_ru'],
        name_en=data['name_en']
    )
    db.session.add(country)

    post = Post_info(
        country_code=data['country_code'],
        post_uz=data['post_uz'],
        post_ru=data['post_ru'],
        post_en=data['post_en']
    )
    db.session.add(post)

    db.session.commit()

    return jsonify({'message': 'Country and post info added successfully'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)