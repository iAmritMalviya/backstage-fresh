import React from "react";

export class ProtectedRoute extends React.Component{
    constructor(props: any){
        super(props)
        this.state = {
            protected: true
        }
    }
isAuthenticated(): boolean {
    return true
}
    render() {
        // const {protected} = this.state;
        // console.log(protected)
        const authenticated = this.isAuthenticated()

        console.log(this.props.children)
        return (
            <>
            { !authenticated ? 
            this.props.children
            :
            <h1>This is else router</h1>}
            </>
        );
    }
}