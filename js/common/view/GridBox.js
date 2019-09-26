// Copyright 2019, University of Colorado Boulder

/**
 * GridBox lays out its children in a grid composed of cells. Children are provided in row-major order,
 * so cells are filled left-to-right, top-to-bottom.  All cells have the same dimensions, and alignment
 * of children within the cells can be specified.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const X_ALIGN_VALUES = [ 'left', 'center', 'right' ];
  const Y_ALIGN_VALUES = [ 'top', 'center', 'bottom' ];

  class GridBox extends Node {

    /**
     * @param {Node[]} nodes - the Nodes in the grid, in row-major order
     * @param {Object} [options]
     */
    constructor( nodes, options ) {

      assert && assert( Array.isArray( nodes ), 'invalid nodes' );

      options = _.extend( {
        columns: 2, // {number} number of columns
        xSpacing: 8, // {number} horizontal spacing between cells
        ySpacing: 8, // {number} vertical spacing between cells
        xAlign: 'center', // {string} horizontal alignment of each Node in its cell, see X_ALIGN_VALUES
        yAlign: 'center' // {string} vertical alignment of each Node in its cell, see Y_ALIGN_VALUES
      }, options );

      // Validate option values
      assert && assert( typeof options.columns === 'number' && options.columns > 0, `invalid columns: ${options.columns}` );
      assert && assert( typeof options.xSpacing === 'number', `invalid xSpacing: ${options.xSpacing}` );
      assert && assert( typeof options.ySpacing === 'number', `invalid ySpacing: ${options.ySpacing}` );
      assert && assert( _.includes( X_ALIGN_VALUES, options.xAlign ), `invalid xAlign: ${options.xAlign}` );
      assert && assert( _.includes( Y_ALIGN_VALUES, options.yAlign ), `invalid xAlign: ${options.yAlign}` );

      // Use an AlignGroup to ensure that every Node in the grid has the same effective bounds.
      const alignGroup = new AlignGroup( {
        matchHorizontal: true,
        matchVertical: true
      } );

      // Process the Nodes, in row-major order
      const vBoxChildren = [];
      let i = 0;
      while ( i < nodes.length ) {

        const hBoxChildren = [];
        for ( let column = 0; column < options.columns && i < nodes.length; column++ ) {

          // Wrap each child in an AlignBox, so that every Node in the grid has the same effective bounds,
          // and is aligned within those bounds as specified by options xAlign and yAlign.
          hBoxChildren.push( new AlignBox( nodes[ i++ ], {
            group: alignGroup,
            xAlign: options.xAlign,
            yAlign: options.yAlign
          } ) );
        }

        vBoxChildren.push( new HBox( {
          children: hBoxChildren,
          spacing: options.xSpacing,
          align: 'origin'
        } ) );
      }

      const vBox = new VBox( {
        children: vBoxChildren,
        spacing: options.ySpacing,
        align: 'left'
      } );

      assert && assert( !options.children, 'GridBox sets children' );
      options.children = [ vBox ];

      super( options );
    }
  }

  return vectorAddition.register( 'GridBox', GridBox );
} );