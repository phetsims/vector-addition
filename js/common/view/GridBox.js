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
     * @param {Node[]} contents - the contentss of the grid, in row-major order
     * @param {Object} [options]
     */
    constructor( contents, options ) {

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

      const vBox = new VBox( {
        spacing: options.ySpacing,
        align: 'left'
      } );

      assert && assert( !options.children, 'GridBox sets children' );
      options.children = [ vBox ];

      super( options );

      // @private
      this.contents = contents;
      this.vBox = vBox;
      this.columns = options.columns;
      this.xSpacing = options.xSpacing;
      this.xAlign = options.xAlign;
      this.yAlign = options.yAlign;

      this.setContents( contents );
    }

    /**
     * Gets the contents of the grid, in row-major order.
     * @returns {Node[]}
     * @public
     */
    getContents() {
      return this.contents;
    }

    /**
     * Sets the contents of the grid, in row-major order.
     * @param {Node[]} contents - the contents of the grid, in row-major order
     * @public
     */
    setContents( contents ) {
      assert && assert( Array.isArray( contents ), 'contents must be an Array' );
      assert && assert( _.every( contents, element => element instanceof Node ), 'every element in contents must be a Node' );

      this.contents = contents;

      // Use an AlignGroup to ensure that every Node in the grid has the same effective bounds.
      const alignGroup = new AlignGroup( {
        matchHorizontal: true,
        matchVertical: true
      } );

      // Process the Nodes, in row-major order
      const vBoxChildren = [];
      let i = 0;
      while ( i < contents.length ) {

        const hBoxChildren = [];
        for ( let column = 0; column < this.columns && i < contents.length; column++ ) {

          // Wrap each child in an AlignBox, so that every Node in the grid has the same effective bounds,
          // and is aligned within those bounds as specified by options xAlign and yAlign.
          hBoxChildren.push( new AlignBox( contents[ i++ ], {
            group: alignGroup,
            xAlign: this.xAlign,
            yAlign: this.yAlign
          } ) );
        }

        vBoxChildren.push( new HBox( {
          children: hBoxChildren,
          spacing: this.xSpacing,
          align: 'origin'
        } ) );
      }

      this.vBox.children = vBoxChildren;
    }
  }

  return vectorAddition.register( 'GridBox', GridBox );
} );