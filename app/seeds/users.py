from app.models import db, User


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        first_name='John',
        last_name='Doe',
        email='demo@demo.com',
        password='password',
        birthday='2000-01-01',
        bio='Live, Laugh, Love',
        lives_in='Santa Barbara, California',
        born_from='Santa Clara, California',
        profile_pic="https://i.imgur.com/rORsHku.png",
        cover_pic='https://www.planetware.com/wpimages/2022/04/california-santa-barbara-top-attractions-things-to-do-intro-paragraph-beach.jpg')

    demo2 = User(
        first_name='Patrick',
        last_name='Mcpherson',
        email='pat@pat.com',
        password='patrick8246',
        birthday='1990-03-10',
        bio='Full stack software engineer. I love it when a team comes together to solve problems',
        lives_in='Santa Barbara, California',
        born_from='Santa Clara, California',
        profile_pic="https://i.imgur.com/Q9QIDEr.png",
        cover_pic='https://cdn.theatlantic.com/thumbor/r_1yJzH4-U4wOh_rLCIhsT0BYVw=/1200x798/media/img/photo/2021/11/photo-trip-faroe-islands/a01_1236295853/original.jpg')

    demo3 = User(
        first_name='Jane',
        last_name='Smith',
        email='jane@demo.com',
        password='password',
        birthday='1994-09-18',
        bio='Beaches are the best!',
        lives_in='Santa Barbara, California',
        born_from='Santa Barbara, California',
        profile_pic="https://i.imgur.com/28Xao2i.png",
        cover_pic='https://www.planetware.com/wpimages/2022/04/california-santa-barbara-top-attractions-things-to-do-intro-paragraph-beach.jpg')

    db.session.add(demo)
    db.session.add(demo2)
    db.session.add(demo3)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
