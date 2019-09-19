// Copyright 2019, University of Colorado Boulder

/**
 * GridLayoutBox lays out is children in a grid.  Children are provided in row-major order.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const X_ALIGN_VALUES = [ 'left', 'center', 'right' ];
  const Y_ALIGN_VALUES = [ 'top', 'center', 'bottom' ];

  class GridLayoutBox extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        columns: 2, // {number} number of columns
        xSpacing: 8, // {number} spacing between each column
        ySpacing: 8, // {number} spacing between each row
        xAlign: 'left', // {string} horizontal alignment of rows, see X_ALIGN_VALUES
        yAlign: 'center', // {string} vertical alignment within a row, see Y_ALIGN_VALUES
        resize: true // {boolean} - whether to update the layout when children change
      }, options );

      // Validate option values
      assert && assert( Array.isArray( options.children ), `invalid children: ${options.children}` );
      assert && assert( typeof options.columns === 'number', `invalid columns: ${options.columns}` );
      assert && assert( typeof options.xSpacing === 'number', `invalid xSpacing: ${options.xSpacing}` );
      assert && assert( typeof options.ySpacing === 'number', `invalid ySpacing: ${options.ySpacing}` );
      assert && assert( _.includes( X_ALIGN_VALUES, options.xAlign ), `invalid xAlign: ${options.xAlign}` );
      assert && assert( _.includes( Y_ALIGN_VALUES, options.yAlign ), `invalid xAlign: ${options.yAlign}` );
      assert && assert( typeof options.resize === 'boolean', `invalid resize: ${options.resize}` );

      // Process options.children, in row-major order
      const vBoxChildren = [];
      let i = 0;
      while ( i < options.children.length ) {

        const hBoxChildren = [];
        for ( let column = 0; column < options.columns && i < options.children.length; column++ ) {
          hBoxChildren.push( options.children[ i++ ] );
        }

        vBoxChildren.push( new HBox( {
          children: hBoxChildren,
          resize: options.resize,
          spacing: options.xSpacing,
          align: options.xAlign
        } ) );
      }

      const vBox = new VBox( {
        children: vBoxChildren,
        resize: options.resize,
        spacing: options.ySpacing,
        align: options.xAlign
      } );

      // Replace options.children with the layout
      options.children = [ vBox ];

      super( options );
    }
  }

  return vectorAddition.register( 'GridLayoutBox', GridLayoutBox );
} );