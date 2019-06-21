// Copyright 2019, University of Colorado Boulder

/**
 * View for the label of a vector
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const BaseVectorModel = require( 'VECTOR_ADDITION/common/model/BaseVectorModel' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );

  // constants

  class VectorLabelNode extends FormulaNode {
    /**
     * @constructor
     * @param {BaseVectorModel} baseVectorModel
     * @param {BooleanProperty} valuesVisibleProperty
     */
    constructor( baseVectorModel, valuesVisibleProperty ) {
      
      assert && assert( baseVectorModel instanceof BaseVectorModel, `invalid baseVectorModel: ${baseVectorModel}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );

      //----------------------------------------------------------------------------------------
      
      super( '' );

      // @public (read-only)
      this.label = baseVectorModel.label;

      const updateLabelOnValuesVisible = () => {

        if ( this.label ) {
          this.setFormula( `\|\\vec{ \\mathrm{${this.label}} \}| = ${baseVectorModel.magnitude}` );
        }
        else {
          this.setFormula( `${baseVectorModel.magnitude}` );
        }

      };


      const updateLabelOnValuesInvisible = () => {

        if ( this.label ) {
          this.setFormula( `\\vec{ \\mathrm{${this.label}} \}` );
        }
        else {
          this.setFormula( '' );
        }

      };

      valuesVisibleProperty.link( ( valuesVisible ) => {
        

        if ( valuesVisible ) {
          updateLabelOnValuesVisible();
        }
        else {
          updateLabelOnValuesInvisible();
        }

      } );


    }

  }

  return vectorAddition.register( 'VectorLabelNode', VectorLabelNode );
} );