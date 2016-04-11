/*jshint devel:true*/
(function(require) {
    'use strict';

    require.config({
        shim: {
            'facebook' : { exports: 'FB' },
            'parse' : {
                exports: 'Parse',
                deps : [ 'facebook' ]
            }
        },
        paths: {
            'facebook': '//connect.facebook.net/en_US/all',
            'stapes' : '//cdnjs.cloudflare.com/ajax/libs/stapes/0.8.1/stapes.min',
            'parse' : '//www.parsecdn.com/js/parse-1.3.4.min',
            'mithril' : '//cdnjs.cloudflare.com/ajax/libs/mithril/0.1.29/mithril.min'
        }
    });

    require([ 'facebook', 'parse', 'mithril' ], function(FB, Parse, m) {
        Parse.initialize('bbBNR1hLfWOS0iZTdMPVAy8O57aGTJDdivEf2wzB', 'TkaVB4wXRXpgOkANUEgdZvsn8QKLK1Lpa1KtrTOK');

        Parse.FacebookUtils.init({
            appId : '394556307384777',
            xfbml : false,
            version : 'v2.2'
        });

        m.route.mode = 'hash';

        var Application = function() {};

        Application.prototype.login = function() {
            Parse.FacebookUtils.logIn(null, {
                success: function(user) {
                    if(! user.existed()) {
                        console.log('User signed up and logged in through Facebook!');
                    }
                    else {
                        console.log('User logged in through Facebook!');
                    }
                },

                error: function(user, error) {
                    console.error(user, error);
                }
            });
        };

        Application.prototype.logout = function() { FB.logout(); };
        Application.prototype.isAuthed = function() { return Parse.User.current(); };
        Application.prototype.isGuest = function() { return ! this.isAuthed(); };

        var app = new Application();

        var modules = {
            elements : {
                navigation : {
                    controller : function() {
                        console.log(this);
                    },

                    view : function() {
                        var links = [
                            { title : 'Home', to : '/' },
                            { title : 'Login', to : '/login' }
                        ];

                        return links.map(function(link) {
                            return m('li', [
                                m('a', {
                                    href : '#/' + link.to.replace(/(^\/|\/$)/, '')
                                }, link.title)
                            ]);
                        });
                    }
                }
            },

            pages : {
                home : {
                    view : function() {
                        return [
                            m('h1', 'NaCl'),
                            m('p.lead',
                                'For decades denizens of the world have been wondering ' +
                                'what Deltrie\'s saltiness levels are (or hell, even how ' +
                                'many fucks he\'s given today). No longer is that a problem!'
                            ),
                            m('p', [
                                m('a.btn.btn-lg.btn-success', 'rate em')
                            ])
                        ];
                    }
                }
            },

            auth : {
                login : {
                    controller : function() {
                        if(app.isGuest()) {
                            app.login();
                        }
                        else {
                            console.log('You be logged in already.');
                        }

                        m.route('/');
                    }
                },

                logout : {
                    controller : function() {
                        app.logout();
                        m.route('/');
                    }
                }
            }
        };

        m.module(document.getElementById('navigation'), modules.elements.navigation);

        m.route(document.getElementById('wrapper'), '/', {
            '/' : modules.pages.home,
            '/login' : modules.auth.login,
            '/logout' : modules.auth.logout
        });
    });
}(window.require));